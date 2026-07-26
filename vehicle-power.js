(() => {
  "use strict";

  const UNIT_SCALE = Object.freeze({ M: 1, G: 1000 });

  function cleanUnit(unit) {
    const normalized = String(unit ?? "").trim().toUpperCase();
    return Object.prototype.hasOwnProperty.call(UNIT_SCALE, normalized) ? normalized : "";
  }

  function decimalPlaces(value) {
    const text = String(value ?? "").trim().replace(/,/g, "");
    if (!/^\d+(?:\.\d+)?$/.test(text)) return Infinity;
    const fraction = text.split(".")[1];
    return fraction ? fraction.length : 0;
  }

  function parse(value, unit) {
    if (value === null || value === undefined || value === "") return null;
    const amount = Number(String(value).replace(/,/g, "").trim());
    const normalizedUnit = cleanUnit(unit);
    if (!Number.isFinite(amount) || amount < 0 || !normalizedUnit) return null;
    return {
      amount,
      unit: normalizedUnit,
      comparisonRank: amount * UNIT_SCALE[normalizedUnit],
    };
  }

  function fromMember(member, vehicleNumber = 1) {
    const prefix = vehicleNumber === 2 ? "vehicle2" : "vehicle1";
    const parsed = parse(member?.[`${prefix}PowerValue`], member?.[`${prefix}PowerUnit`]);
    if (parsed) return parsed;

    const normalized = Number(member?.[`${prefix}PowerNormalized`]);
    if (!Number.isFinite(normalized) || normalized < 0) return null;
    return { amount: normalized, unit: "M", comparisonRank: normalized };
  }

  function roundForDisplay(amount) {
    return Math.round((Number(amount) + Number.EPSILON) * 10) / 10;
  }

  function displayNumber(amount, locale = "ko-KR") {
    const rounded = roundForDisplay(amount);
    return rounded.toLocaleString(locale, {
      minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  }

  function format(value, unit, options = {}) {
    const parsed = parse(value, unit);
    if (!parsed) return options.empty ?? "-";
    return `${displayNumber(parsed.amount, options.locale)}${parsed.unit}`;
  }

  function formatMember(member, vehicleNumber = 1, options = {}) {
    const prefix = vehicleNumber === 2 ? "vehicle2" : "vehicle1";
    return format(
      member?.[`${prefix}PowerValue`],
      member?.[`${prefix}PowerUnit`],
      options,
    );
  }

  // Aggregate values are already normalized for calculation. Convert only for
  // human-readable display; stored member values and units remain unchanged.
  function formatNormalized(normalizedValue, options = {}) {
    const value = Number(normalizedValue);
    if (!Number.isFinite(value) || value < 0) return options.empty ?? "-";
    if (value >= 1000) return `${displayNumber(value / 1000, options.locale)}G`;
    return `${displayNumber(value, options.locale)}M`;
  }

  function compareValues(aValue, aUnit, bValue, bUnit) {
    const left = parse(aValue, aUnit);
    const right = parse(bValue, bUnit);
    if (!left && !right) return 0;
    if (!left) return -1;
    if (!right) return 1;
    return left.comparisonRank - right.comparisonRank;
  }

  function compareMembers(a, b, vehicleNumber = 1) {
    const left = fromMember(a, vehicleNumber);
    const right = fromMember(b, vehicleNumber);
    if (!left && !right) return 0;
    if (!left) return -1;
    if (!right) return 1;
    return left.comparisonRank - right.comparisonRank;
  }

  function normalized(member, vehicleNumber = 1) {
    return fromMember(member, vehicleNumber)?.comparisonRank ?? 0;
  }

  function isValidInput(value, unit, maxDecimals = 2) {
    if ((value === null || value === undefined || value === "") && !cleanUnit(unit)) return true;
    const parsed = parse(value, unit);
    return Boolean(parsed) && parsed.amount > 0 && decimalPlaces(value) <= maxDecimals;
  }

  window.EZPKVehiclePower = Object.freeze({
    parse,
    fromMember,
    normalized,
    format,
    formatMember,
    formatNormalized,
    compareValues,
    compareMembers,
    isValidInput,
    decimalPlaces,
  });
})();
