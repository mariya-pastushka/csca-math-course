import { question, step, topic, vocab, worked } from './helpers.js'

const positiveNegative = topic({
  id: 'positive-negative',
  lessonId: 'lesson-1',
  number: 1,
  title: 'Positive and Negative Numbers',
  titleRu: 'Положительные и отрицательные числа',
  summary: 'Научимся видеть знак числа, сравнивать расстояния от нуля и уверенно складывать и вычитать числа со знаками.',
  vocabulary: [
    vocab('Positive number', 'Положительное число', 'Число больше нуля. Например, 5. Знак + обычно можно не писать.'),
    vocab('Negative number', 'Отрицательное число', 'Число меньше нуля. Перед ним всегда стоит знак минус.'),
    vocab('Number line', 'Числовая прямая', 'Линия, на которой числа растут вправо и уменьшаются влево.'),
    vocab('Absolute value', 'Модуль числа', 'Расстояние от числа до нуля. Поэтому модуль всегда неотрицательный.'),
    vocab('Addition', 'Сложение', 'Операция, в которой числа объединяются.'),
    vocab('Subtraction', 'Вычитание', 'Операция, в которой от одного числа отнимают другое.'),
  ],
  theory: [
    {
      title: 'Знак показывает сторону от нуля',
      text: 'Положительные числа находятся справа от нуля, отрицательные — слева. Чем правее число на числовой прямой, тем оно больше.',
      formula: '-5 < -2 < 0 < 3 < 8',
    },
    {
      title: 'Модуль — это расстояние',
      text: 'Модуль не учитывает направление. Числа −6 и 6 находятся на одинаковом расстоянии от нуля, поэтому их модули равны.',
      formula: '|-6| = |6| = 6',
    },
    {
      title: 'Вычитание превращаем в сложение',
      text: 'Вычесть число — значит прибавить противоположное. Это особенно полезно, когда перед вторым числом стоит минус.',
      formula: 'a-b=a+(-b)',
    },
  ],
  rules: [
    {
      title: 'Одинаковые знаки',
      text: 'Сложи модули и сохрани общий знак.',
      formula: '(-5)+(-3)=-(5+3)=-8',
      cue: 'Same signs → add → keep the sign',
    },
    {
      title: 'Разные знаки',
      text: 'Вычти меньший модуль из большего и возьми знак числа с большим модулем.',
      formula: '-9+4=-(9-4)=-5',
      cue: 'Different signs → subtract → keep the stronger sign',
    },
  ],
  miniExamples: [
    { expression: '4+3', answer: '7', note: 'Два положительных числа.' },
    { expression: '-4+(-3)', answer: '-7', note: 'Одинаковые отрицательные знаки.' },
    { expression: '8+(-5)', answer: '3', note: 'Разные знаки: 8−5.' },
    { expression: '-8+5', answer: '-3', note: 'Модуль 8 больше, поэтому ответ отрицательный.' },
    { expression: '6-(-2)', answer: '8', note: 'Минус перед отрицательным числом меняется на плюс.' },
  ],
  workedExamples: [
    worked('Легко', '-7+4', [
      step('Шаг 1', 'Сначала смотрим на знаки. Они разные: −7 отрицательное, 4 положительное.'),
      step('Шаг 2', 'Сравниваем модули. Семь больше четырёх.', '|-7|=7>4'),
      step('Шаг 3', 'При разных знаках вычитаем меньший модуль из большего.', '7-4=3'),
      step('Шаг 4', 'Больший модуль принадлежит числу −7, поэтому сохраняем минус.'),
    ], '-3'),
    worked('Средне', '-12+(-9)', [
      step('Шаг 1', 'Оба числа отрицательные. Значит, знаки одинаковые.'),
      step('Шаг 2', 'Складываем модули чисел.', '12+9=21'),
      step('Шаг 3', 'Сохраняем общий отрицательный знак.'),
    ], '-21'),
    worked('Средне +', '6-(-11)', [
      step('Шаг 1', 'Вычитание отрицательного числа заменяем сложением положительного.', '6-(-11)=6+11'),
      step('Шаг 2', 'Оба слагаемых теперь положительные, поэтому просто складываем.', '6+11=17'),
    ], '17'),
    worked('В стиле CSCA', '-18-7+25', [
      step('Шаг 1', 'Идём слева направо. Сначала −18−7. Это то же самое, что прибавить −7.', '-18-7=-18+(-7)'),
      step('Шаг 2', 'Знаки одинаковые: складываем модули и сохраняем минус.', '-18+(-7)=-25'),
      step('Шаг 3', 'Теперь −25+25 — противоположные числа. Их сумма равна нулю.', '-25+25=0'),
    ], '0'),
  ],
  practiceQuestions: [
    question({ id: 'pn-p1', question: 'Вычислите.', formula: '-6+(-5)', answer: -11, solution: [step('Шаг 1', 'Знаки одинаковые, поэтому складываем модули.', '6+5=11'), step('Шаг 2', 'Оба числа отрицательные — сохраняем минус.')], explanation: 'Ответ: −11.', skill: 'Сложение отрицательных чисел' }),
    question({ id: 'pn-p2', question: 'Вычислите.', formula: '9+(-4)', answer: 5, solution: [step('Шаг 1', 'Знаки разные. Сравниваем модули: 9 больше 4.'), step('Шаг 2', 'Вычитаем меньший модуль из большего.', '9-4=5'), step('Шаг 3', 'Больший модуль у положительного 9, поэтому ответ положительный.')], explanation: 'Ответ: 5.', skill: 'Сложение чисел с разными знаками' }),
    question({ id: 'pn-p3', question: 'Чему равен модуль числа?', formula: '|-13|', answer: 13, options: ['-13', '0', '13', '26'], solution: [step('Шаг 1', 'Модуль — расстояние до нуля.'), step('Шаг 2', 'Расстояние от −13 до нуля равно 13.')], explanation: 'Ответ: 13.', skill: 'Модуль числа' }),
    question({ id: 'pn-p4', question: 'Вычислите.', formula: '-15+8', answer: -7, solution: [step('Шаг 1', 'Знаки разные, значит вычитаем модули.', '15-8=7'), step('Шаг 2', 'Больший модуль 15 принадлежит отрицательному числу. Сохраняем минус.')], explanation: 'Ответ: −7.', skill: 'Сравнение модулей' }),
    question({ id: 'pn-p5', question: 'Вычислите.', formula: '7-(-6)', answer: 13, solution: [step('Шаг 1', 'Вычитание отрицательного заменяем сложением.', '7-(-6)=7+6'), step('Шаг 2', 'Складываем.', '7+6=13')], explanation: 'Ответ: 13.', skill: 'Вычитание отрицательного числа' }),
    question({ id: 'pn-p6', question: 'Температура была −3°C и повысилась на 8°C. Какой стала температура?', answer: 5, options: ['-11', '-5', '5', '11'], solution: [step('Шаг 1', 'Повысилась означает прибавить 8.', '-3+8'), step('Шаг 2', 'Знаки разные: 8−3=5. Больший модуль у +8.')], explanation: 'Ответ: 5°C.', difficulty: 'В стиле CSCA', skill: 'Применение отрицательных чисел' }),
  ],
  homeworkQuestions: [
    question({ id: 'pn-h1', question: 'What is the value of', formula: '-4+(-7)', answer: -11, options: ['-11', '-3', '3', '11'], solution: [step('Шаг 1', 'Знаки одинаковые: складываем 4 и 7.'), step('Шаг 2', 'Сохраняем отрицательный знак.')], explanation: 'Ответ: −11.', difficulty: 'Легко', skill: 'Сложение отрицательных чисел' }),
    question({ id: 'pn-h2', question: 'What is the absolute value of', formula: '-16', answer: 16, options: ['-16', '-1', '0', '16'], solution: [step('Шаг 1', 'Модуль — расстояние до нуля.'), step('Шаг 2', 'Расстояние от −16 до нуля равно 16.')], explanation: 'Ответ: 16.', difficulty: 'Легко', skill: 'Модуль числа' }),
    question({ id: 'pn-h3', question: 'Calculate.', formula: '-9+14', answer: 5, options: ['-23', '-5', '5', '23'], solution: [step('Шаг 1', 'Знаки разные. Вычитаем модули: 14−9=5.'), step('Шаг 2', 'Больший модуль у +14, поэтому знак плюс.')], explanation: 'Ответ: 5.', difficulty: 'Средне', skill: 'Разные знаки' }),
    question({ id: 'pn-h4', question: 'Calculate.', formula: '8-(-5)', answer: 13, options: ['-13', '3', '13', '40'], solution: [step('Шаг 1', 'Минус перед отрицательным числом превращается в плюс.', '8-(-5)=8+5'), step('Шаг 2', 'Складываем: 13.')], explanation: 'Ответ: 13.', difficulty: 'Средне', skill: 'Вычитание отрицательного числа' }),
    question({ id: 'pn-h5', question: 'Calculate from left to right.', formula: '-18+7-4', answer: -15, options: ['-29', '-15', '-7', '15'], solution: [step('Шаг 1', '−18+7: знаки разные. 18−7=11, сохраняем минус.', '-18+7=-11'), step('Шаг 2', '−11−4 = −11+(−4). Знаки одинаковые.', '-11-4=-15')], explanation: 'Ответ: −15.', difficulty: 'Средне +', skill: 'Несколько действий' }),
    question({ id: 'pn-h6', question: 'A diver is at −12 m. He rises 7 m and then descends 3 m. What is his final position?', answer: -8, options: ['-22', '-8', '-2', '8'], solution: [step('Шаг 1', 'Подъём на 7 м означает +7.', '-12+7=-5'), step('Шаг 2', 'Спуск на 3 м означает −3.', '-5-3=-8')], explanation: 'Ответ: −8 м.', difficulty: 'В стиле экзамена', skill: 'Текстовая задача' }),
    question({ id: 'pn-h7', question: 'Find the missing number.', formula: '-6+x=-14', answer: -8, options: ['-20', '-8', '8', '20'], solution: [step('Шаг 1', 'Нужно понять, какое число прибавили к −6, чтобы получить −14.'), step('Шаг 2', 'Разность между модулями равна 8, двигаться нужно в отрицательную сторону.', '-6+(-8)=-14')], explanation: 'Ответ: −8.', difficulty: 'Challenge', skill: 'Обратная операция' }),
  ],
})

const multiplicationDivision = topic({
  id: 'signs-multiplication-division',
  lessonId: 'lesson-1',
  number: 2,
  title: 'Multiplication and Division Signs',
  titleRu: 'Знаки при умножении и делении',
  summary: 'Разберём единое правило знаков и научимся применять его к нескольким множителям.',
  vocabulary: [
    vocab('Multiplication', 'Умножение', 'Операция повторного сложения одинаковых величин.'),
    vocab('Division', 'Деление', 'Операция, которая показывает, сколько раз одно число содержится в другом.'),
    vocab('Factor', 'Множитель', 'Число, которое участвует в умножении.'),
    vocab('Product', 'Произведение', 'Результат умножения.'),
    vocab('Quotient', 'Частное', 'Результат деления.'),
  ],
  theory: [
    { title: 'Одинаковые знаки дают плюс', text: 'Если у двух чисел одинаковые знаки, результат умножения или деления положительный.', formula: '(+)\times(+)=+\\quad (-)\times(-)=+' },
    { title: 'Разные знаки дают минус', text: 'Если у чисел разные знаки, результат отрицательный.', formula: '(+)\times(-)=-\\quad (-)\div(+)=-' },
    { title: 'Несколько отрицательных множителей', text: 'Считайте количество минусов. Чётное количество даёт плюс, нечётное — минус.', formula: '(-2)(-3)(-4)=-24' },
  ],
  rules: [
    { title: 'Главное правило', text: 'Same signs → Positive. Different signs → Negative.', formula: '-18\div(-3)=6', cue: 'Сначала знак, потом числа' },
    { title: 'Ноль', text: 'Любое число, умноженное на ноль, равно нулю. Делить на ноль нельзя.', formula: 'a\times0=0\\quad a\div0\\text{ — не определено}', cue: 'Never divide by zero' },
  ],
  miniExamples: [
    { expression: '4\\times3', answer: '12', note: 'Плюс на плюс даёт плюс.' },
    { expression: '-4\\times3', answer: '-12', note: 'Разные знаки дают минус.' },
    { expression: '-20\\div(-5)', answer: '4', note: 'Одинаковые знаки дают плюс.' },
    { expression: '24\\div(-6)', answer: '-4', note: 'Разные знаки дают минус.' },
    { expression: '(-2)(-3)(5)', answer: '30', note: 'Два минуса — чётное количество.' },
  ],
  workedExamples: [
    worked('Легко', '-6\\times4', [
      step('Шаг 1', 'Смотрим только на знаки: минус и плюс разные. Результат будет отрицательным.'),
      step('Шаг 2', 'Умножаем модули.', '6\\times4=24'),
    ], '-24'),
    worked('Средне', '-42\\div(-7)', [
      step('Шаг 1', 'Оба знака отрицательные, то есть одинаковые. Результат положительный.'),
      step('Шаг 2', 'Делим модули.', '42\\div7=6'),
    ], '6'),
    worked('Средне +', '(-3)(-5)(-2)', [
      step('Шаг 1', 'Здесь три отрицательных множителя. Три — нечётное число, поэтому общий знак минус.'),
      step('Шаг 2', 'Умножаем модули.', '3\\times5\\times2=30'),
    ], '-30'),
    worked('В стиле CSCA', '-72\\div6\\times(-2)', [
      step('Шаг 1', 'Умножение и деление имеют одинаковый приоритет, поэтому идём слева направо.'),
      step('Шаг 2', '−72 и 6 имеют разные знаки.', '-72\\div6=-12'),
      step('Шаг 3', 'Теперь −12 и −2 имеют одинаковые знаки.', '-12\\times(-2)=24'),
    ], '24'),
  ],
  practiceQuestions: [
    question({ id: 'md-p1', question: 'Вычислите.', formula: '-7\\times5', answer: -35, solution: [step('Шаг 1', 'Знаки разные — результат отрицательный.'), step('Шаг 2', '7×5=35.')], explanation: 'Ответ: −35.', skill: 'Знаки при умножении' }),
    question({ id: 'md-p2', question: 'Вычислите.', formula: '-36\\div(-6)', answer: 6, options: ['-6', '0', '6', '30'], solution: [step('Шаг 1', 'Знаки одинаковые — результат положительный.'), step('Шаг 2', '36÷6=6.')], explanation: 'Ответ: 6.', skill: 'Знаки при делении' }),
    question({ id: 'md-p3', question: 'Определите только знак результата.', formula: '(-4)(7)(-2)', answer: '+', options: ['+', '-', '0', 'Нельзя определить'], solution: [step('Шаг 1', 'Считаем отрицательные множители: их два.'), step('Шаг 2', 'Чётное число минусов даёт плюс.')], explanation: 'Знак результата: +.', skill: 'Несколько множителей' }),
    question({ id: 'md-p4', question: 'Вычислите.', formula: '54\\div(-9)', answer: -6, solution: [step('Шаг 1', 'Плюс и минус — разные знаки, поэтому результат отрицательный.'), step('Шаг 2', '54÷9=6.')], explanation: 'Ответ: −6.', skill: 'Знаки при делении' }),
    question({ id: 'md-p5', question: 'Вычислите.', formula: '(-2)(-3)(-5)', answer: -30, options: ['-30', '-10', '10', '30'], solution: [step('Шаг 1', 'Три минуса — нечётное количество. Знак ответа минус.'), step('Шаг 2', '2×3×5=30.')], explanation: 'Ответ: −30.', skill: 'Несколько множителей' }),
    question({ id: 'md-p6', question: 'Вычислите слева направо.', formula: '-48\\div(-8)\\times(-3)', answer: -18, options: ['-18', '-2', '2', '18'], solution: [step('Шаг 1', '−48÷(−8)=6, потому что знаки одинаковые.'), step('Шаг 2', '6×(−3)=−18, потому что знаки разные.')], explanation: 'Ответ: −18.', difficulty: 'В стиле CSCA', skill: 'Цепочка операций' }),
  ],
  homeworkQuestions: [
    question({ id: 'md-h1', question: 'Calculate.', formula: '-8\\times3', answer: -24, options: ['-24', '-11', '11', '24'], solution: [step('Шаг 1', 'Разные знаки дают минус.'), step('Шаг 2', '8×3=24.')], explanation: 'Ответ: −24.', difficulty: 'Легко', skill: 'Умножение со знаками' }),
    question({ id: 'md-h2', question: 'Calculate.', formula: '-45\\div(-5)', answer: 9, options: ['-9', '-5', '5', '9'], solution: [step('Шаг 1', 'Одинаковые знаки дают плюс.'), step('Шаг 2', '45÷5=9.')], explanation: 'Ответ: 9.', difficulty: 'Легко', skill: 'Деление со знаками' }),
    question({ id: 'md-h3', question: 'Which expression has a negative value?', answer: 'B) (-3)(4)', options: ['A) (-3)(-4)', 'B) (-3)(4)', 'C) 12÷3', 'D) (-12)÷(-3)'], solution: [step('Шаг 1', 'Отрицательный результат получается при разных знаках.'), step('Шаг 2', 'Только вариант B содержит один отрицательный и один положительный множитель.')], explanation: 'Ответ: B.', difficulty: 'Средне', skill: 'Распознавание знака' }),
    question({ id: 'md-h4', question: 'Calculate.', formula: '(-4)(-6)(2)', answer: 48, options: ['-48', '-12', '12', '48'], solution: [step('Шаг 1', 'Два минуса дают положительный знак.'), step('Шаг 2', '4×6×2=48.')], explanation: 'Ответ: 48.', difficulty: 'Средне', skill: 'Несколько множителей' }),
    question({ id: 'md-h5', question: 'Calculate from left to right.', formula: '60\\div(-5)\\times3', answer: -36, options: ['-36', '-4', '4', '36'], solution: [step('Шаг 1', '60÷(−5)=−12.'), step('Шаг 2', '−12×3=−36.')], explanation: 'Ответ: −36.', difficulty: 'Средне +', skill: 'Цепочка операций' }),
    question({ id: 'md-h6', question: 'A balance changes by −$6 each day for 8 days. What is the total change?', answer: -48, options: ['-$48', '-$14', '$14', '$48'], solution: [step('Шаг 1', 'Изменение −6 повторяется 8 раз.'), step('Шаг 2', '−6×8=−48.')], explanation: 'Ответ: −$48.', difficulty: 'В стиле экзамена', skill: 'Модель умножения' }),
    question({ id: 'md-h7', question: 'Find the value.', formula: '(-2)^3\\times(-4)', answer: 32, options: ['-32', '-16', '16', '32'], solution: [step('Шаг 1', 'Сначала вычисляем степень.', '(-2)^3=-8'), step('Шаг 2', 'Умножаем два отрицательных числа.', '-8\\times(-4)=32')], explanation: 'Ответ: 32.', difficulty: 'Challenge', skill: 'Знаки и степень' }),
  ],
})

const orderOperations = topic({
  id: 'order-of-operations',
  lessonId: 'lesson-1',
  number: 3,
  title: 'Brackets and Order of Operations',
  titleRu: 'Скобки и порядок действий',
  summary: 'Научимся читать выражение по уровням: скобки, степени, умножение и деление, затем сложение и вычитание.',
  vocabulary: [
    vocab('Parentheses', 'Скобки', 'Показывают, какую часть выражения нужно вычислить первой.'),
    vocab('Exponent', 'Степень', 'Показывает, сколько раз число умножается само на себя.'),
    vocab('Order of operations', 'Порядок действий', 'Правило, которое определяет последовательность вычислений.'),
    vocab('Left to right', 'Слева направо', 'Порядок для действий одинакового приоритета.'),
  ],
  theory: [
    { title: 'PEMDAS', text: 'P — Parentheses, E — Exponents, M/D — Multiplication and Division, A/S — Addition and Subtraction.', formula: 'P\\rightarrow E\\rightarrow M/D\\rightarrow A/S' },
    { title: 'Умножение и деление равноправны', text: 'Не нужно всегда делать умножение раньше деления. Выполняйте их слева направо.', formula: '12\\div3\\times2=4\\times2=8' },
    { title: 'Сложение и вычитание тоже равноправны', text: 'Когда остаются только + и −, тоже идите слева направо.', formula: '10-4+2=6+2=8' },
  ],
  rules: [
    { title: 'Работайте слоями', text: 'Сначала упростите выражение внутри скобок. Затем степени. Потом × и ÷ слева направо. В конце + и − слева направо.', formula: '5+2(8-3)=5+2\\times5=15', cue: 'Brackets → powers → ×/÷ → +/−' },
    { title: 'Записывайте одну строку за раз', text: 'Не пытайтесь сделать несколько разных действий в уме. Новая строка уменьшает риск ошибки.', formula: '18-6\\div3=18-2=16', cue: 'One safe step at a time' },
  ],
  miniExamples: [
    { expression: '3+2\\times5', answer: '13', note: 'Сначала умножение.' },
    { expression: '(3+2)\\times5', answer: '25', note: 'Сначала скобки.' },
    { expression: '18-6\\div3', answer: '16', note: 'Сначала деление.' },
    { expression: '20\\div(2+3)', answer: '4', note: 'Сначала 2+3.' },
    { expression: '3^2+4\\times2', answer: '17', note: 'Степень, затем умножение, затем сложение.' },
  ],
  workedExamples: [
    worked('Легко', '3+2\\times5', [
      step('Шаг 1', 'Умножение имеет больший приоритет, чем сложение.', '2\\times5=10'),
      step('Шаг 2', 'Теперь складываем.', '3+10=13'),
    ], '13'),
    worked('Средне', '(3+2)\\times5', [
      step('Шаг 1', 'Скобки выполняются первыми.', '3+2=5'),
      step('Шаг 2', 'Умножаем результат скобок на 5.', '5\\times5=25'),
    ], '25'),
    worked('Средне +', '5+2\\times(8-3)', [
      step('Шаг 1', 'Сначала вычисляем выражение в скобках.', '8-3=5'),
      step('Шаг 2', 'Умножение выполняем раньше сложения.', '2\\times5=10'),
      step('Шаг 3', 'Складываем оставшиеся числа.', '5+10=15'),
    ], '15'),
    worked('В стиле CSCA', '24\\div(2+4)\\times3+2^2', [
      step('Шаг 1', 'Сначала скобки.', '2+4=6'),
      step('Шаг 2', 'Затем степень.', '2^2=4'),
      step('Шаг 3', 'Деление и умножение выполняем слева направо.', '24\\div6\\times3=4\\times3=12'),
      step('Шаг 4', 'В конце сложение.', '12+4=16'),
    ], '16'),
  ],
  practiceQuestions: [
    question({ id: 'oo-p1', question: 'Вычислите.', formula: '4+3\\times2', answer: 10, solution: [step('Шаг 1', 'Сначала умножаем: 3×2=6.'), step('Шаг 2', 'Затем 4+6=10.')], explanation: 'Ответ: 10.', skill: 'Умножение до сложения' }),
    question({ id: 'oo-p2', question: 'Вычислите.', formula: '(4+3)\\times2', answer: 14, options: ['10', '12', '14', '18'], solution: [step('Шаг 1', 'Сначала скобки: 4+3=7.'), step('Шаг 2', '7×2=14.')], explanation: 'Ответ: 14.', skill: 'Скобки' }),
    question({ id: 'oo-p3', question: 'Вычислите слева направо.', formula: '24\\div6\\times3', answer: 12, options: ['1.33', '4', '12', '72'], solution: [step('Шаг 1', 'Деление и умножение равноправны, идём слева направо.'), step('Шаг 2', '24÷6=4.'), step('Шаг 3', '4×3=12.')], explanation: 'Ответ: 12.', skill: 'Одинаковый приоритет' }),
    question({ id: 'oo-p4', question: 'Вычислите.', formula: '20-8\\div4', answer: 18, solution: [step('Шаг 1', 'Сначала деление: 8÷4=2.'), step('Шаг 2', '20−2=18.')], explanation: 'Ответ: 18.', skill: 'Деление до вычитания' }),
    question({ id: 'oo-p5', question: 'Вычислите.', formula: '2^3+5\\times2', answer: 18, options: ['16', '18', '21', '26'], solution: [step('Шаг 1', 'Степень: 2³=8.'), step('Шаг 2', 'Умножение: 5×2=10.'), step('Шаг 3', 'Сложение: 8+10=18.')], explanation: 'Ответ: 18.', skill: 'Степени и действия' }),
    question({ id: 'oo-p6', question: 'Вычислите.', formula: '30\\div(4+2)+3\\times2', answer: 11, options: ['7', '10', '11', '16'], solution: [step('Шаг 1', 'Скобки: 4+2=6.'), step('Шаг 2', 'Деление и умножение: 30÷6=5, 3×2=6.'), step('Шаг 3', 'Сложение: 5+6=11.')], explanation: 'Ответ: 11.', difficulty: 'В стиле CSCA', skill: 'Полный порядок действий' }),
  ],
  homeworkQuestions: [
    question({ id: 'oo-h1', question: 'Calculate.', formula: '7+2\\times4', answer: 15, options: ['15', '18', '28', '36'], solution: [step('Шаг 1', '2×4=8.'), step('Шаг 2', '7+8=15.')], explanation: 'Ответ: 15.', difficulty: 'Легко', skill: 'Умножение до сложения' }),
    question({ id: 'oo-h2', question: 'Calculate.', formula: '(7+2)\\times4', answer: 36, options: ['15', '28', '32', '36'], solution: [step('Шаг 1', '7+2=9.'), step('Шаг 2', '9×4=36.')], explanation: 'Ответ: 36.', difficulty: 'Легко', skill: 'Скобки' }),
    question({ id: 'oo-h3', question: 'Calculate from left to right.', formula: '18\\div3\\times2', answer: 12, options: ['3', '12', '18', '36'], solution: [step('Шаг 1', '18÷3=6.'), step('Шаг 2', '6×2=12.')], explanation: 'Ответ: 12.', difficulty: 'Средне', skill: 'Равный приоритет' }),
    question({ id: 'oo-h4', question: 'Calculate.', formula: '25-3\\times(6-2)', answer: 13, options: ['13', '22', '44', '88'], solution: [step('Шаг 1', 'Скобки: 6−2=4.'), step('Шаг 2', 'Умножение: 3×4=12.'), step('Шаг 3', 'Вычитание: 25−12=13.')], explanation: 'Ответ: 13.', difficulty: 'Средне', skill: 'Скобки и умножение' }),
    question({ id: 'oo-h5', question: 'Calculate.', formula: '4^2+18\\div3-5', answer: 17, options: ['11', '17', '19', '27'], solution: [step('Шаг 1', 'Степень: 4²=16.'), step('Шаг 2', 'Деление: 18÷3=6.'), step('Шаг 3', 'Слева направо: 16+6−5=17.')], explanation: 'Ответ: 17.', difficulty: 'Средне +', skill: 'Степени' }),
    question({ id: 'oo-h6', question: 'Find the value of', formula: '3+4(2-5)', answer: -9, options: ['-9', '-6', '9', '15'], solution: [step('Шаг 1', 'Скобки: 2−5=−3.'), step('Шаг 2', 'Умножение: 4×(−3)=−12.'), step('Шаг 3', '3+(−12)=−9.')], explanation: 'Ответ: −9.', difficulty: 'В стиле экзамена', skill: 'Порядок действий со знаками' }),
    question({ id: 'oo-h7', question: 'Calculate.', formula: '48\\div[2(3+1)]+5', answer: 11, options: ['6', '11', '17', '101'], solution: [step('Шаг 1', 'Скобки: 3+1=4.'), step('Шаг 2', 'В квадратных скобках: 2×4=8.'), step('Шаг 3', '48÷8=6.'), step('Шаг 4', '6+5=11.')], explanation: 'Ответ: 11.', difficulty: 'Challenge', skill: 'Вложенная структура' }),
  ],
})

export const lesson1 = {
  id: 'lesson-1',
  number: 1,
  title: 'Signs, Brackets and Order of Operations',
  titleRu: 'Знаки, скобки и порядок действий',
  description: 'Фундамент вычислений: числа со знаками, правила умножения и порядок действий.',
  subtopics: [positiveNegative, multiplicationDivision, orderOperations],
}
