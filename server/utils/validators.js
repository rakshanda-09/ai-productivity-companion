const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const isFutureOrPresentDate = (value) => {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
};

const assert = (condition, message) => {
  if (!condition) {
    const err = new Error(message);
    err.statusCode = 400;
    throw err;
  }
};

module.exports = { isEmail, isNonEmptyString, isFutureOrPresentDate, assert };
