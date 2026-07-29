(() => {
  "use strict";

  const UNIT_SCALE = Object.freeze({ M: 1, G: 1000 });
  const COMBAT_SCALE = Object.freeze({ K: 1e3, M: 1e6, G: 1e9, B: 1e9 });

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
    return { amount, unit: normalizedUnit, comparisonRank: amount * UNIT_SCALE[normalizedUnit] };
  }

  function fromMember(member, vehicleNumber = 1) {
    const prefix = vehicleNumber === 2 ? "vehicle2" : "vehicle1";
    const parsed = parse(member?.[`${prefix}PowerValue`], member?.[`${prefix}PowerUnit`]);
    if (parsed) return parsed;
    const normalized = Number(member?.[`${prefix}PowerNormalized`]);
    if (!Number.isFinite(normalized) || normalized < 0) return null;
    return { amount: normalized, unit: "M", comparisonRank: normalized };
  }

  function displayNumber(value, options = {}) {
    const locale = options.locale || "ko-KR";
    const max = Number.isInteger(options.maximumFractionDigits) ? options.maximumFractionDigits : 0;
    const min = Number.isInteger(options.minimumFractionDigits) ? options.minimumFractionDigits : 0;
    const mode = options.roundingMode === "floor" ? "floor" : "round";
    const factor = 10 ** max;
    const adjusted = mode === "floor" ? Math.floor((Number(value) + Number.EPSILON) * factor) / factor : Number(value);
    return adjusted.toLocaleString(locale, { minimumFractionDigits: min, maximumFractionDigits: max });
  }

  function formatNormalized(normalizedValue, options = {}) {
    const value = Number(normalizedValue);
    if (!Number.isFinite(value) || value <= 0) return options.empty ?? "-";
    if (value >= 1000) return `${displayNumber(value / 1000, options)}G`;
    return `${displayNumber(value, { ...options, maximumFractionDigits: options.mMaximumFractionDigits ?? 0 })}M`;
  }

  function format(value, unit, options = {}) {
    const parsed = parse(value, unit);
    if (!parsed || parsed.comparisonRank <= 0) return options.empty ?? "-";
    return formatNormalized(parsed.comparisonRank, options);
  }

  function formatMember(member, vehicleNumber = 1, options = {}) {
    const parsed = fromMember(member, vehicleNumber);
    return parsed ? formatNormalized(parsed.comparisonRank, options) : (options.empty ?? "-");
  }

  function parseCombatPower(rawValue) {
    if (rawValue === null || rawValue === undefined || rawValue === "") return null;
    const text = String(rawValue).replace(/,/g, "").trim().toUpperCase();
    const match = text.match(/^([+-]?\d+(?:\.\d+)?)\s*([KMGB])?$/);
    if (!match) return null;
    const amount = Number(match[1]);
    if (!Number.isFinite(amount) || amount < 0) return null;
    const unit = match[2] || "";
    return amount * (COMBAT_SCALE[unit] || 1);
  }

  function formatCombatPower(rawValue, options = {}) {
    const value = parseCombatPower(rawValue);
    if (!Number.isFinite(value) || value <= 0) return options.empty ?? "-";
    const locale = options.locale || "ko-KR";
    const digits = options.maximumFractionDigits ?? 2;
    if (value >= 1e9) return `${(value / 1e9).toLocaleString(locale,{minimumFractionDigits:0,maximumFractionDigits:digits})}G`;
    if (value >= 1e6) return `${(value / 1e6).toLocaleString(locale,{minimumFractionDigits:0,maximumFractionDigits:digits})}M`;
    if (value >= 1e3) return `${(value / 1e3).toLocaleString(locale,{minimumFractionDigits:0,maximumFractionDigits:digits})}K`;
    return value.toLocaleString(locale,{maximumFractionDigits:0});
  }

  function formatIndustryLevel(rawValue, options = {}) {
    const value = Number(String(rawValue ?? "").trim().replace(/^I/i, ""));
    if (!Number.isFinite(value) || value <= 0) return options.empty ?? "-";
    return `i${Math.floor(value)}`;
  }

  function compareValues(aValue, aUnit, bValue, bUnit) {
    const left = parse(aValue, aUnit), right = parse(bValue, bUnit);
    if (!left && !right) return 0;
    if (!left) return -1;
    if (!right) return 1;
    return left.comparisonRank - right.comparisonRank;
  }

  function compareMembers(a, b, vehicleNumber = 1) {
    const left = fromMember(a, vehicleNumber), right = fromMember(b, vehicleNumber);
    if (!left && !right) return 0;
    if (!left) return -1;
    if (!right) return 1;
    return left.comparisonRank - right.comparisonRank;
  }

  function normalized(member, vehicleNumber = 1) { return fromMember(member, vehicleNumber)?.comparisonRank ?? 0; }
  function isValidInput(value, unit, maxDecimals = 2) {
    if ((value === null || value === undefined || value === "") && !cleanUnit(unit)) return true;
    const parsed = parse(value, unit);
    return Boolean(parsed) && parsed.amount > 0 && decimalPlaces(value) <= maxDecimals;
  }

  window.EZPKVehiclePower = Object.freeze({
    parse, fromMember, normalized, format, formatMember, formatNormalized,
    parseCombatPower, formatCombatPower, formatIndustryLevel,
    compareValues, compareMembers, isValidInput, decimalPlaces,
  });
})();
