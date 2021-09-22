function formatNumber(n, x) {
    var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
    return n.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
}
var SectionKind;
(function (SectionKind) {
    SectionKind["LECTURE"] = "l";
    SectionKind["RECITATION"] = "r";
    SectionKind["LAB"] = "b";
})(SectionKind || (SectionKind = {}));
var Timeslot = /** @class */ (function () {
    function Timeslot(timeslot) {
        this.startSlot = timeslot[0], this.numSlots = timeslot[1];
    }
    return Timeslot;
}());
var Section = /** @class */ (function () {
    function Section(cls, kind, section) {
        this.cls = cls;
        this.kind = kind;
        var rawSlots = section[0], room = section[1];
        this.timeslots = rawSlots.map(function (slot) { return new Timeslot(slot); });
        this.room = room;
    }
    return Section;
}());
// rawClass wraper
var Class = /** @class */ (function () {
    function Class(rawClass) {
        this.rawClass = rawClass;
    }
    Object.defineProperty(Class.prototype, "number", {
        get: function () {
            return this.rawClass.n;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Class.prototype, "units", {
        get: function () {
            return this.rawClass.u1 + this.rawClass.u2 + this.rawClass.u3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Class.prototype, "hours", {
        get: function () {
            var setToUnits = !this.rawClass.h;
            return {
                hours: setToUnits ? this.units : this.rawClass.h,
                setToUnits: setToUnits
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Class.prototype, "sectionKinds", {
        get: function () {
            var map = {
                l: SectionKind.LECTURE,
                r: SectionKind.RECITATION,
                b: SectionKind.LAB
            };
            return this.rawClass.s.map(function (kind) { return map[kind]; });
        },
        enumerable: false,
        configurable: true
    });
    Class.prototype.sectionsOfKind = function (kind) {
        var _this = this;
        return this.rawClass[kind].map(function (sec) { return new Section(_this, kind, sec); });
    };
    Object.defineProperty(Class.prototype, "sections", {
        get: function () {
            var _this = this;
            return this.sectionKinds.map(function (kind) { return _this.sectionsOfKind(kind); }).flat();
        },
        enumerable: false,
        configurable: true
    });
    return Class;
}());
var Firehose = /** @class */ (function () {
    function Firehose(rawClasses) {
        this.currentClasses = [];
        this.rawClasses = rawClasses;
        this.evalTableRows = rawClasses.map(function (cls) { return [
            cls.no,
            formatNumber(cls.ra, 1),
            formatNumber(cls.h, 1),
            cls.n,
        ]; });
    }
    Firehose.prototype.fillTable = function (isSelected) {
        return this.evalTableRows.filter(function (_a) {
            var cls = _a[0];
            return isSelected(cls);
        });
    };
    return Firehose;
}());
