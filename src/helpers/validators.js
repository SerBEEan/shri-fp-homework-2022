import { propEq, allPass, equals, count, compose, juxt, converge, not, countBy, toLower, anyPass, prop, lte, lt } from 'ramda';
import { values } from 'lodash';
import { COLORS, SHAPES } from '../constants';

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const RED = prop('RED')(COLORS);
const GREEN = prop('GREEN')(COLORS);
const BLUE = prop('BLUE')(COLORS);
const WHITE = prop('WHITE')(COLORS);
const ORANGE = prop('ORANGE')(COLORS);

const TRIANGLE = prop('TRIANGLE')(SHAPES);
const SQUARE = prop('SQUARE')(SHAPES);
const CIRCLE = prop('CIRCLE')(SHAPES);
const STAR = prop('STAR')(SHAPES);

const isStarRed = propEq(STAR, RED);
const isStarGreen = propEq(STAR, GREEN);
const isStarBlue = propEq(STAR, BLUE);
const isStarOrange = propEq(STAR, ORANGE);

const isSquareRed = propEq(SQUARE, RED);
const isSquareGreen = propEq(SQUARE, GREEN);
const isSquareBlue = propEq(SQUARE, BLUE);
const isSquareOrange = propEq(SQUARE, ORANGE);

const isTriangleRed = propEq(TRIANGLE, RED);
const isTriangleGreen = propEq(TRIANGLE, GREEN);
const isTriangleBlue = propEq(TRIANGLE, BLUE);
const isTriangleWhite = propEq(TRIANGLE, WHITE);
const isTriangleOrange = propEq(TRIANGLE, ORANGE);

const isCircleRed = propEq(CIRCLE, RED);
const isCircleGreen = propEq(CIRCLE, GREEN);
const isCircleBlue = propEq(CIRCLE, BLUE);
const isCircleWhite = propEq(CIRCLE, WHITE);
const isCircleOrange = propEq(CIRCLE, ORANGE);

const eachShapeIsGreen = juxt([isStarGreen, isSquareGreen, isTriangleGreen, isCircleGreen]);
const eachShapeIsBlue = juxt([isStarBlue, isSquareBlue, isTriangleBlue, isCircleBlue]);
const eachShapeIsRed = juxt([isStarRed, isSquareRed, isTriangleRed, isCircleRed]);

const countOfTruthyElements = count(x => x);
const groupCountOfValues = countBy(toLower);

const countShapeIsGreen = compose(countOfTruthyElements, eachShapeIsGreen);
const countShapeIsBlue = compose(countOfTruthyElements, eachShapeIsBlue);
const countShapeIsRed = compose(countOfTruthyElements, eachShapeIsRed);

const getTriangle = prop(TRIANGLE);
const getSquare = prop(SQUARE);

const isNotWhiteTriangle = compose(not, equals(WHITE), getTriangle);
const isNotWhiteSquare = compose(not, equals(WHITE), getSquare);

const isCountRedMoreThree = compose(lte(3), prop(RED), groupCountOfValues, values);
const isCountOrangeMoreThree = compose(lte(3), prop(ORANGE), groupCountOfValues, values);
const isCountGreenMoreThree = compose(lte(3), prop(GREEN), groupCountOfValues, values);
const isCountBlueMoreThree = compose(lte(3), prop(BLUE), groupCountOfValues, values);

const isCountRedEqualOne = compose(equals(1), prop(RED), groupCountOfValues, values);
const isCountGreenEqualTwo = compose(equals(2), prop(GREEN), groupCountOfValues, values);

const isCountRedMoreZero = compose(lt(0), prop(RED), groupCountOfValues, values);
const isCountBlueMoreZero = compose(lt(0), prop(BLUE), groupCountOfValues, values);

const isRedAnyShapeButNotTriangle = anyPass([isStarRed, isSquareRed, isCircleRed]);
const isTriangleAndSquareSameColor = converge(equals, [getTriangle, getSquare]);

const isOnlyRedAnyShapeButNotTriangle = allPass([isRedAnyShapeButNotTriangle, isCountRedEqualOne]);
const isEqualsCountRedAndBlue = converge(equals, [countShapeIsBlue, countShapeIsRed]);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isStarRed, isSquareGreen, isTriangleWhite, isCircleWhite]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(lte(2), countShapeIsGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = allPass([isEqualsCountRedAndBlue, isCountRedMoreZero, isCountBlueMoreZero]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isCircleBlue, isStarRed, isSquareOrange]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([isCountRedMoreThree, isCountOrangeMoreThree, isCountGreenMoreThree, isCountBlueMoreThree]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([isTriangleGreen, isCountGreenEqualTwo, isOnlyRedAnyShapeButNotTriangle]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([isStarOrange, isSquareOrange, isTriangleOrange, isCircleOrange]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = anyPass([isStarGreen, isStarBlue, isStarOrange]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([isStarGreen, isSquareGreen, isTriangleGreen, isCircleGreen]);;

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([isTriangleAndSquareSameColor, isNotWhiteTriangle, isNotWhiteSquare]);
