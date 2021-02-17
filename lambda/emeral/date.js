const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];
const transformDates = (dates) => {
  const createdAt = new Date(
    +dates.createdYear,
    MONTHS.indexOf(dates.createdMonth),
    +dates.createdDay
  ).getTime();
  const updatedAt = new Date(
    +dates.updatedYear,
    MONTHS.indexOf(dates.updatedMonth),
    +dates.updatedDay
  ).getTime();

  return { createdAt, updatedAt };
};

exports.transformDates = transformDates;
