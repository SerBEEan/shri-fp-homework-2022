import { __, lt, prop, compose, allPass, invoker, not, test, ifElse, modulo, pipe, curry, tap } from 'ramda';
import { round } from 'lodash';
import Api from '../tools/api';

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

const api = new Api();

const CORRECT_FORMAT_STRING = /^[\d.]+$/;

const getValue = prop('value');
const getWriteLog = prop('writeLog');
const getHandleSuccess = prop('handleSuccess');
const getHandleError = prop('handleError');
const getLength = prop('length');
const getResult = prop('result');

const isMoreTowSymbols = compose(lt(2), getLength);
const isLessTenSymbols = compose(lt(__, 10), getLength);
const isCorrectFormatString = test(CORRECT_FORMAT_STRING);
const isValueValid = allPass([isMoreTowSymbols, isLessTenSymbols, isCorrectFormatString]);
const isValueInvalid = compose(not, isValueValid);

const tube = x => x;
const powSquared = x => x ** 2;
const throwValidationError = () => {throw 'ValidationError';}

const getPromiseResolve = value => invoker(1, 'resolve')(value)(Promise);
const then = invoker(1, 'then');
const thenWithCatch = invoker(2, 'then');

const checkInvalidString = ifElse(isValueInvalid, throwValidationError, tube);
const makeResponse = (path, options) => invoker(2, 'get')(path, options)(api);
const makeBinaryNumberResponse = number => makeResponse('https://api.tech/numbers/base', {from: 10, to: 2, number});
const makeAnimalNameResponse = id => makeResponse(`https://animals.tech/${id}`, {});

const getFieldFromProps = curry((getter, props) => getter(props));
const log = props => tap(getFieldFromProps(getWriteLog)(props));

const getBinaryNumber = props => compose(makeBinaryNumberResponse, log(props), round);
const getAnimalName = props => compose(
    makeAnimalNameResponse,
    log(props),
    modulo(__, 3),
    log(props),
    powSquared,
    log(props),
    getLength,
    log(props),
    getResult
);
const sendSuccessName = props => compose(getHandleSuccess(props), getResult);

const processSequence = props => {
    pipe(
        then(log(props)),
        then(checkInvalidString),
        then(getBinaryNumber(props)),
        then(getAnimalName(props)),
        thenWithCatch(sendSuccessName(props), getHandleError(props))
    )(getPromiseResolve(getValue(props)));
}

export default processSequence;
