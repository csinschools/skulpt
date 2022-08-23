/** @typedef {Sk.builtin.object} */ var pyObject;

/**
 * builtins are supposed to come from the __builtin__ module, but we don't do
 * that yet.
 * todo; these should all be func objects too, otherwise str() of them won't
 * work, etc.
 */


Sk.builtin.asnum$ = function (a) {
    if (a === undefined) {
        return a;
    }
    if (a === null) {
        return a;
    }
    if (typeof a === "number") {
        return a;
    }
    if (a instanceof Sk.builtin.int_) {
        if (typeof a.v === "number") {
            return a.v;
        }
        return a.v.toString(); // then we have a BigInt
    }
    if (a instanceof Sk.builtin.float_) {
        return a.v;
    }
    if (a === Sk.builtin.none.none$) {
        return null;
    }
    if (typeof a === "string") {
        return a;
    }
    return a;
};

Sk.exportSymbol("Sk.builtin.asnum$", Sk.builtin.asnum$);

/**
 * Return a Python number (either float or int) from a Javascript number.
 *
 * Javacsript function, returns Python object.
 *
 * @param  {number} a Javascript number to transform into Python number.
 * @return {(Sk.builtin.int_|Sk.builtin.float_)} A Python number.
 */
Sk.builtin.assk$ = function (a) {
    if (a % 1 === 0) {
        return new Sk.builtin.int_(a);
    } else {
        return new Sk.builtin.float_(a);
    }
};
Sk.exportSymbol("Sk.builtin.assk$", Sk.builtin.assk$);

Sk.builtin.asnum$nofloat = function (a) {
    var decimal;
    var mantissa;
    var expon;
    if (a === undefined) {
        return a;
    } else if (a === null) {
        return a;
    } else if (typeof a === "number") {
        a = a.toString();
    } else if (a instanceof Sk.builtin.int_) {
        a = a.v.toString();
    } else if (a instanceof Sk.builtin.float_) {
        a = a.v.toString();
    } else if (a === Sk.builtin.none.none$) {
        return null;
    } else {
        return undefined;
    }

    //  Sk.debugout("INITIAL: " + a);

    //  If not a float, great, just return this
    if (a.indexOf(".") < 0 && a.indexOf("e") < 0 && a.indexOf("E") < 0) {
        return a;
    }

    expon = 0;

    if (a.indexOf("e") >= 0) {
        mantissa = a.substr(0, a.indexOf("e"));
        expon = a.substr(a.indexOf("e") + 1);
    } else if (a.indexOf("E") >= 0) {
        mantissa = a.substr(0, a.indexOf("e"));
        expon = a.substr(a.indexOf("E") + 1);
    } else {
        mantissa = a;
    }

    expon = parseInt(expon, 10);

    decimal = mantissa.indexOf(".");

    //  Simplest case, no decimal
    if (decimal < 0) {
        if (expon >= 0) {
            // Just add more zeroes and we're done
            while (expon-- > 0) {
                mantissa += "0";
            }
            return mantissa;
        } else {
            if (mantissa.length > -expon) {
                return mantissa.substr(0, mantissa.length + expon);
            } else {
                return 0;
            }
        }
    }

    //  Negative exponent OR decimal (neg or pos exp)
    if (decimal === 0) {
        mantissa = mantissa.substr(1);
    } else if (decimal < mantissa.length) {
        mantissa = mantissa.substr(0, decimal) + mantissa.substr(decimal + 1);
    } else {
        mantissa = mantissa.substr(0, decimal);
    }

    decimal = decimal + expon;
    while (decimal > mantissa.length) {
        mantissa += "0";
    }

    if (decimal <= 0) {
        mantissa = 0;
    } else {
        mantissa = mantissa.substr(0, decimal);
    }

    return mantissa;
};
Sk.exportSymbol("Sk.builtin.asnum$nofloat", Sk.builtin.asnum$nofloat);

Sk.builtin.round = function round(number, ndigits) {
    if (number === undefined) {
        throw new Sk.builtin.TypeError("a float is required");
    }
    if (!Sk.__future__.dunder_round) {
        if (!Sk.builtin.checkNumber(number)) {
            throw new Sk.builtin.TypeError("a float is required");
        }
        if (number.round$) {
            return number.round$(ndigits);
        } else {
            throw new Sk.builtin.AttributeError(Sk.abstr.typeName(number) + " instance has no attribute '__float__'");
        }
    }

    if (ndigits !== undefined && !Sk.builtin.checkNone(ndigits) && !Sk.misceval.isIndex(ndigits)) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(ndigits) + "' object cannot be interpreted as an index");
    }

    // try calling internal magic method
    const special = Sk.abstr.lookupSpecial(number, Sk.builtin.str.$round);
    if (special !== undefined) {
        // method on builtin, provide this arg
        if (ndigits !== undefined) {
            return Sk.misceval.callsimArray(special, [ndigits]);
        } else {
            return Sk.misceval.callsimArray(special, []);
        }
    } else {
        throw new Sk.builtin.TypeError("a float is required");
    }
};

Sk.builtin.len = function len(item) {
    // checking will happen in slot wrapper
    let res;
    if (item.sq$length) {
        res = item.sq$length(true);
    } else {
        throw new Sk.builtin.TypeError("object of type '" + Sk.abstr.typeName(item) + "' has no len()");
    }
    return Sk.misceval.chain(res, (r) => {
        return new Sk.builtin.int_(r);
    });
};

Sk.builtin.min = function min(args, kwargs) {
    let iter;
    const nargs = args.length;
    if (!nargs) {
        throw new Sk.builtin.TypeError("min expected 1 argument, got 0");
    }
    const [$default, key] = Sk.abstr.copyKeywordsToNamedArgs("min", ["default", "key"], [], kwargs, [null, Sk.builtin.none.none$]);

    // if args is not a single iterable then default should not be included as a kwarg
    if (nargs > 1 && $default !== null) {
        throw new Sk.builtin.TypeError("Cannot specify a default for min() with multiple positional arguments");
    }

    if (nargs == 1) {
        iter = Sk.abstr.iter(args[0]);
    } else {
        iter = Sk.abstr.iter(new Sk.builtin.tuple(args));
    }

    if (!Sk.builtin.checkNone(key) && !Sk.builtin.checkCallable(key)) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(key) + "' object is not callable");
    }

    let lowest;
    return Sk.misceval.chain(
        iter.tp$iternext(true),
        (i) => {
            lowest = i;
            if (lowest === undefined) {
                return;
            }
            if (Sk.builtin.checkNone(key)) {
                return Sk.misceval.iterFor(iter, (i) => {
                    if (Sk.misceval.richCompareBool(i, lowest, "Lt")) {
                        lowest = i;
                    }
                });
            } else {
                return Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(key, [lowest]), (lowest_compare) =>
                    Sk.misceval.iterFor(iter, (i) =>
                        Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(key, [i]), (i_compare) => {
                            if (Sk.misceval.richCompareBool(i_compare, lowest_compare, "Lt")) {
                                lowest = i;
                                lowest_compare = i_compare;
                            }
                        })
                    )
                );
            }
        },
        () => {
            if (lowest === undefined) {
                if ($default === null) {
                    throw new Sk.builtin.ValueError("min() arg is an empty sequence");
                } else {
                    lowest = $default;
                }
            }
            return lowest;
        }
    );
};

Sk.builtin.max = function max(args, kwargs) {
    let iter;
    const nargs = args.length;

    if (!nargs) {
        throw new Sk.builtin.TypeError("max expected 1 argument, got 0");
    }
    const [$default, key] = Sk.abstr.copyKeywordsToNamedArgs("max", ["default", "key"], [], kwargs, [null, Sk.builtin.none.none$]);

    // if args is not a single iterable then default should not be included as a kwarg
    if (nargs > 1 && $default !== null) {
        throw new Sk.builtin.TypeError("Cannot specify a default for max() with multiple positional arguments");
    }

    if (nargs === 1) {
        iter = Sk.abstr.iter(args[0]);
    } else {
        iter = Sk.abstr.iter(new Sk.builtin.tuple(args));
    }

    if (!Sk.builtin.checkNone(key) && !Sk.builtin.checkCallable(key)) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(key) + "' object is not callable");
    }
    let highest;
    return Sk.misceval.chain(
        iter.tp$iternext(true),
        (i) => {
            highest = i;
            if (highest === undefined) {
                return;
            }
            if (Sk.builtin.checkNone(key)) {
                return Sk.misceval.iterFor(iter, (i) => {
                    if (Sk.misceval.richCompareBool(i, highest, "Gt")) {
                        highest = i;
                    }
                });
            } else {
                return Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(key, [highest]), (highest_compare) =>
                    Sk.misceval.iterFor(iter, (i) =>
                        Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(key, [i]), (i_compare) => {
                            if (Sk.misceval.richCompareBool(i_compare, highest_compare, "Gt")) {
                                highest = i;
                                highest_compare = i_compare;
                            }
                        })
                    )
                );
            }
        },
        () => {
            if (highest === undefined) {
                if ($default === null) {
                    throw new Sk.builtin.ValueError("max() arg is an empty sequence");
                } else {
                    highest = $default;
                }
            }
            return highest;
        }
    );
};

// incase someone calls these functions via Sk.misceval.call
Sk.builtin.min.co_fastcall = Sk.builtin.max.co_fastcall = 1;

Sk.builtin.any = function any(iter) {
    return Sk.misceval.chain(
        Sk.misceval.iterFor(Sk.abstr.iter(iter), function (i) {
            if (Sk.misceval.isTrue(i)) {
                return new Sk.misceval.Break(Sk.builtin.bool.true$);
            }
        }),
        (brValue) => brValue || Sk.builtin.bool.false$
    );
};

Sk.builtin.all = function all(iter) {
    return Sk.misceval.chain(
        Sk.misceval.iterFor(Sk.abstr.iter(iter), function (i) {
            if (!Sk.misceval.isTrue(i)) {
                return new Sk.misceval.Break(Sk.builtin.bool.false$);
            }
        }),
        (brValue) => brValue || Sk.builtin.bool.true$
    );
};

Sk.builtin.sum = function sum(iter, start) {
    var tot;
    // follows the order of CPython checks
    const it = Sk.abstr.iter(iter);
    if (start === undefined) {
        tot = new Sk.builtin.int_(0);
    } else if (Sk.builtin.checkString(start)) {
        throw new Sk.builtin.TypeError("sum() can't sum strings [use ''.join(seq) instead]");
    } else {
        tot = start;
    }

    function fastSumInt() {
        return Sk.misceval.iterFor(it, (i) => {
            if (i.constructor === Sk.builtin.int_) {
                tot = tot.nb$add(i);
            } else if (i.constructor === Sk.builtin.float_) {
                tot = tot.nb$float().nb$add(i);
                return new Sk.misceval.Break("float");
            } else {
                tot = Sk.abstr.numberBinOp(tot, i, "Add");
                return new Sk.misceval.Break("slow");
            }
        });
    }

    function fastSumFloat() {
        return Sk.misceval.iterFor(it, (i) => {
            if (i.constructor === Sk.builtin.float_ || i.constructor === Sk.builtin.int_) {
                tot = tot.nb$add(i);
            } else {
                tot = Sk.abstr.numberBinOp(tot, i, "Add");
                return new Sk.misceval.Break("slow");
            }
        });
    }

    function slowSum() {
        return Sk.misceval.iterFor(it, (i) => {
            tot = Sk.abstr.numberBinOp(tot, i, "Add");
        });
    }

    let sumType;
    if (start === undefined || start.constructor === Sk.builtin.int_) {
        sumType = fastSumInt();
    } else if (start.constructor === Sk.builtin.float_) {
        sumType = "float";
    } else {
        sumType = "slow";
    }

    return Sk.misceval.chain(
        sumType,
        (sumType) => {
            if (sumType === "float") {
                return fastSumFloat();
            }
            return sumType;
        },
        (sumType) => {
            if (sumType === "slow") {
                return slowSum();
            }
        },
        () => tot
    );
};

Sk.builtin.zip = function zip() {
    var el;
    var tup;
    var done;
    var res;
    var i;
    var iters;
    if (arguments.length === 0) {
        return new Sk.builtin.list([]);
    }

    iters = [];
    for (i = 0; i < arguments.length; i++) {
        if (Sk.builtin.checkIterable(arguments[i])) {
            iters.push(Sk.abstr.iter(arguments[i]));
        } else {
            throw new Sk.builtin.TypeError("argument " + i + " must support iteration");
        }
    }
    res = [];
    done = false;
    while (!done) {
        tup = [];
        for (i = 0; i < arguments.length; i++) {
            el = iters[i].tp$iternext();
            if (el === undefined) {
                done = true;
                break;
            }
            tup.push(el);
        }
        if (!done) {
            res.push(new Sk.builtin.tuple(tup));
        }
    }
    return new Sk.builtin.list(res);
};

Sk.builtin.abs = function abs(x) {
    if (x.nb$abs) {
        return x.nb$abs();
    }
    throw new Sk.builtin.TypeError("bad operand type for abs(): '" + Sk.abstr.typeName(x) + "'");
};

// fabs belongs in the math module but has been a Skulpt builtin since 41665a97d (2012).
// Left in for backwards compatibility for now
Sk.builtin.fabs = function fabs(x) {
    return Sk.builtin.abs(x);
};

Sk.builtin.ord = function ord (x) {
    if (Sk.builtin.checkString(x)) {
        if (x.v.length !== 1 && x.sq$length() !== 1) {
            // ^^ avoid the astral check unless necessary ^^
            throw new Sk.builtin.TypeError("ord() expected a character, but string of length " + x.v.length + " found");
        }
        return new Sk.builtin.int_(x.v.codePointAt(0));
    } else if (Sk.builtin.checkBytes(x)) {
        if (x.sq$length() !== 1) {
            throw new Sk.builtin.TypeError("ord() expected a character, but string of length " + x.v.length + " found");
        }
        return new Sk.builtin.int_(x.v[0]);
    }
    throw new Sk.builtin.TypeError("ord() expected a string of length 1, but " + Sk.abstr.typeName(x) + " found");
};

Sk.builtin.chr = function chr(x) {
    if (!Sk.builtin.checkInt(x)) {
        throw new Sk.builtin.TypeError("an integer is required");
    }
    x = Sk.builtin.asnum$(x);
    if (Sk.__future__.python3) {
        if ((x < 0) || (x >= 0x110000)) {
            throw new Sk.builtin.ValueError("chr() arg not in range(0x110000)");
        }
    } else {
        if ((x < 0) || (x >= 256)) {
            throw new Sk.builtin.ValueError("chr() arg not in range(256)");
        }
    }

    return new Sk.builtin.str(String.fromCodePoint(x));
};

Sk.builtin.unichr = function unichr(x) {
    Sk.builtin.pyCheckArgsLen("unichr", arguments.length, 1, 1);
    if (!Sk.builtin.checkInt(x)) {
        throw new Sk.builtin.TypeError("an integer is required");
    }
    x = Sk.builtin.asnum$(x);

    try {
        return new Sk.builtin.str(String.fromCodePoint(x));
    } catch (err) {
        if (err instanceof RangeError) {
            throw new Sk.builtin.ValueError(err.message);
        }
        throw err;
    }
};

/**
 * This is a helper function and we already know that x is an int or has an nb$index slot
 */
Sk.builtin.int2str_ = function helper_(x, radix, prefix) {
    let v = x.nb$index();
    let isNegative = false;
    if (typeof v === "number") {
        isNegative = v < 0;
        v = isNegative ? -v : v;
    } else {
        isNegative = JSBI.lessThan(v, JSBI.__ZERO);
        v = isNegative ? JSBI.unaryMinus(v) : v;
    }
    let str = v.toString(radix);
    if (isNegative) {
        str = "-" + prefix + str;
    } else {
        str = prefix + str;
    }
    if (radix !== 2 && !Sk.__future__.python3 && (x instanceof Sk.builtin.lng || JSBI.__isBigInt(v))) {
        str += "L";
    }
    return new Sk.builtin.str(str);
};

Sk.builtin.hex = function hex(x) {
    if (!Sk.misceval.isIndex(x)) {
        throw new Sk.builtin.TypeError("hex() argument can't be converted to hex");
    }
    return Sk.builtin.int2str_(x, 16, "0x");
};

Sk.builtin.oct = function oct(x) {
    if (!Sk.misceval.isIndex(x)) {
        throw new Sk.builtin.TypeError("oct() argument can't be converted to hex");
    }
    if (Sk.__future__.octal_number_literal) {
        return Sk.builtin.int2str_(x, 8, "0o");
    } else {
        return Sk.builtin.int2str_(x, 8, "0");
    }
};

Sk.builtin.bin = function bin(x) {
    if (!Sk.misceval.isIndex(x)) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(x) + "' object can't be interpreted as an index");
    }
    return Sk.builtin.int2str_(x, 2, "0b");
};


Sk.builtin.dir = function dir(obj) {
    if (obj !== undefined) {
        const obj_dir_func = Sk.abstr.lookupSpecial(obj, Sk.builtin.str.$dir);
        return Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(obj_dir_func, []), (dir) => Sk.builtin.sorted(dir));
        // now iter through the keys and check they are all stings
    }
    // then we want all the objects in the global scope
    //todo
    throw new Sk.builtin.NotImplementedError("skulpt does not yet support dir with no args");
};

Sk.builtin.repr = function repr(x) {
    return x.$r();
};

Sk.builtin.ascii = function ascii (x) {
    return Sk.misceval.chain(x.$r(), (r) => {
        let ret;
        let i;
        // Fast path
        for (i=0; i < r.v.length; i++) {
            if (r.v.charCodeAt(i) >= 0x7f) {
                ret = r.v.substr(0, i);
                break;
            }
        }
        if (!ret) {
            return r;
        }
        for (; i < r.v.length; i++) {
            let c = r.v.charAt(i);
            let cc = r.v.charCodeAt(i);

            if (cc > 0x7f && cc <= 0xff) {
                let ashex = cc.toString(16);
                if (ashex.length < 2) {
                    ashex = "0" + ashex;
                }
                ret += "\\x" + ashex;
            } else if (cc > 0x7f && cc < 0xd800 || cc >= 0xe000) {
                // BMP
                ret += "\\u" + ("000"+cc.toString(16)).slice(-4);
            } else if (cc >= 0xd800) {
                // Surrogate pair stuff
                let val = r.v.codePointAt(i);
                i++;

                val = val.toString(16);
                let s = ("0000000"+val.toString(16));
                if (val.length > 4) {
                    ret += "\\U" + s.slice(-8);
                } else {
                    ret += "\\u" + s.slice(-4);
                }
            } else {
                ret += c;
            }
        }
        return new Sk.builtin.str(ret);
    });
};

Sk.builtin.open = function open (filename, mode, bufsize) {
    if (mode === undefined) {
        mode = new Sk.builtin.str("r");
    }

    if (/\+/.test(mode.v)) {
        throw "todo; haven't implemented read/write mode";
    } else if ((mode.v === "w" || mode.v === "wb" || mode.v === "a" || mode.v === "ab") && !Sk.nonreadopen) {
        throw "todo; haven't implemented non-read opens";
    }

    return new Sk.builtin.file(filename, mode, bufsize);
};


Sk.builtin.isinstance = function isinstance(obj, type) {
    if (!Sk.builtin.checkClass(type) && !(type instanceof Sk.builtin.tuple)) {
        throw new Sk.builtin.TypeError("isinstance() arg 2 must be a class, type, or tuple of classes and types");
    }

    // Fast path
    const act_type = obj.ob$type;
    if (act_type === type) {
        return Sk.builtin.bool.true$;
    }
    if (!(type instanceof Sk.builtin.tuple)) {
        // attempt 1
        if (act_type.$isSubType(type)) {
            return Sk.builtin.bool.true$;
        }
        // fail so check if we have overriden __class__
        const maybe_type = obj.tp$getattr(Sk.builtin.str.$class);
        if (maybe_type == act_type) {
            return Sk.builtin.bool.false$;
        } else if (Sk.builtin.checkClass(maybe_type) && maybe_type.$isSubType(type)) {
            return Sk.builtin.bool.true$;
        }
        return Sk.builtin.bool.false$;
    }
    // Handle tuple type argument
    for (let i = 0; i < type.v.length; ++i) {
        if (Sk.misceval.isTrue(Sk.builtin.isinstance(obj, type.v[i]))) {
            return Sk.builtin.bool.true$;
        }
    }
    return Sk.builtin.bool.false$;
};

Sk.builtin.hash = function hash(obj) {
    return new Sk.builtin.int_(Sk.abstr.objectHash(obj));
};

Sk.builtin.getattr = function getattr(obj, pyName, default_) {
    if (!Sk.builtin.checkString(pyName)) {
        throw new Sk.builtin.TypeError("attribute name must be string");
    }
    const res = Sk.misceval.tryCatch(
        () => obj.tp$getattr(pyName, true),
        (e) => {
            if (e instanceof Sk.builtin.AttributeError) {
                return undefined;
            } else {
                throw e;
            }
        }
    );
    return Sk.misceval.chain(res, (r) => {
        if (r === undefined) {
            if (default_ !== undefined) {
                return default_;
            }
            throw new Sk.builtin.AttributeError(obj.sk$attrError() + " has no attribute " + Sk.misceval.objectRepr(pyName));
        }
        return r;
    });
};

Sk.builtin.setattr = function setattr(obj, pyName, value) {
    // cannot set or del attr from builtin type
    if (!Sk.builtin.checkString(pyName)) {
        throw new Sk.builtin.TypeError("attribute name must be string");
    }
    return Sk.misceval.chain(obj.tp$setattr(pyName, value, true), () => Sk.builtin.none.none$);
};

Sk.builtin.raw_input = function (prompt) {
    var lprompt = prompt ? prompt : "";

    return Sk.misceval.chain(Sk.importModule("sys", false, true), function (sys) {
        if (Sk.inputfunTakesPrompt) {
            return Sk.builtin.file.$readline(sys["$d"]["stdin"], null, lprompt);
        } else {
            return Sk.misceval.chain(
                undefined,
                function () {
                    return Sk.misceval.callsimOrSuspendArray(sys["$d"]["stdout"]["write"], [sys["$d"]["stdout"], new Sk.builtin.str(lprompt)]);
                },
                function () {
                    return Sk.misceval.callsimOrSuspendArray(sys["$d"]["stdin"]["readline"], [sys["$d"]["stdin"]]);
                }
            );
        }
    });
};

Sk.builtin.input = Sk.builtin.raw_input;

Sk.builtin.jseval = function jseval (evalcode) {
    const result = Sk.global["eval"](Sk.ffi.remapToJs(evalcode));
    return Sk.ffi.remapToPy(result);
};

/**
 * @deprecated
 */
Sk.builtin.jsmillis = function jsmillis() {
    console.warn("jsmillis is deprecated");
    var now = new Date();
    return now.valueOf();
};

const pyCode = Sk.abstr.buildNativeClass("code", {
    constructor: function code(filename, compiled) {
        this.compiled = compiled;
        this.code = compiled.code;
        this.filename = filename;
    },
    slots: {
        tp$new(args, kwargs) {
            throw new Sk.builtin.NotImplementedError("cannot construct a code object in skulpt");
        },
        $r() {
            return new Sk.builtin.str("<code object <module>, file " + this.filename + ">");
        },
    },
});

Sk.builtin.compile = function (source, filename, mode, flags, dont_inherit, optimize) {
    Sk.builtin.pyCheckType("source", "str", Sk.builtin.checkString(source));
    Sk.builtin.pyCheckType("filename", "str", Sk.builtin.checkString(filename));
    Sk.builtin.pyCheckType("mode", "str", Sk.builtin.checkString(mode));
    source = source.$jsstr();
    filename = filename.$jsstr();
    mode = mode.$jsstr();
    return Sk.misceval.chain(Sk.compile(source, filename, mode, true), (co) => new pyCode(filename, co));
};

/**
 *
 * @param {*} code
 * @param {Object|undefined} globals
 * @param {Object|undefined} locals
 *
 * Internally call with javascript objects for globals and locals
 */
Sk.builtin.exec = function (code, globals, locals) {
    let filename = globals && globals.__file__;
    if (filename !== undefined && Sk.builtin.checkString(filename)) {
        filename = filename.toString();
    } else {
        filename = "<string>";
    }
    if (Sk.builtin.checkString(code)) {
        code = Sk.compile(code.$jsstr(), filename, "exec", true);
    } else if (typeof code === "string") {
        code = Sk.compile(code, filename, "exec", true);
    } else if (!(code instanceof pyCode)) {
        throw new Sk.builtin.TypeError("exec() arg 1 must be a string, bytes or code object");
    }
    Sk.asserts.assert(
        globals === undefined || globals.constructor === Object,
        "internal calls to exec should be called with a javascript object for globals"
    );
    Sk.asserts.assert(
        locals === undefined || locals.constructor === Object,
        "internal calls to exec should be called with a javascript object for locals"
    );
    /**@todo shouldn't have to do this - Sk.globals loses scope*/
    const tmp = Sk.globals;
    /** 
     * @todo this is not correct outside of __main__ i.e. exec doesn't work inside modules using the module scope
     * This is because globals don't work outside of __main__
    */
    globals = globals || tmp;
    return Sk.misceval.chain(
        code,
        (co) => Sk.global["eval"](co.code)(globals, locals),
        (new_locals) => {
            Sk.globals = tmp;
            // we return new_locals internally for eval
            return new_locals;
        }
    );
};


Sk.builtin.eval = function (source, globals, locals) {
    if (Sk.builtin.checkString(source)) {
        source = source.$jsstr();
    } else if (Sk.builtin.checkBytes(source)) {
        throw new Sk.builtin.NotImplementedError("bytes for eval is not yet implemented in skulpt");
    }
    if (typeof source === "string") {
        source = source.trim();
        const parse = Sk.parse("?", source);
        const ast = Sk.astFromParse(parse.cst, "?", parse.flags);
        if (ast.body.length > 1 || !(ast.body[0] instanceof Sk.astnodes.Expr)) {
            throw new Sk.builtin.SyntaxError("invalid syntax");
        }
        source = "__final_res__ = " + source;
    } else if (!(source instanceof pyCode)) {
        throw new Sk.builtin.TypeError("eval() arg 1 must be a string, bytes or code object");
    }
    return Sk.misceval.chain(Sk.builtin.exec(source, globals, locals), (new_locals) => {
        const res = new_locals.__final_res__ || Sk.builtin.none.none$;
        delete new_locals.__final_res__;
        return res;
    });
};

Sk.builtin.map = function map(fun, seq) {
    var retval = [];
    var next;
    var nones;
    var args;
    var argnum;
    var i;
    var iterables;
    var combined;
    Sk.builtin.pyCheckArgsLen("map", arguments.length, 2);

    if (arguments.length > 2) {
        // Pack sequences into one list of Javascript Arrays

        combined = [];
        iterables = Array.prototype.slice.apply(arguments).slice(1);
        for (i = 0; i < iterables.length; i++) {
            if (!Sk.builtin.checkIterable(iterables[i])) {
                argnum = parseInt(i, 10) + 2;
                throw new Sk.builtin.TypeError("argument " + argnum + " to map() must support iteration");
            }
            iterables[i] = Sk.abstr.iter(iterables[i]);
        }

        while (true) {
            args = [];
            nones = 0;
            for (i = 0; i < iterables.length; i++) {
                next = iterables[i].tp$iternext();
                if (next === undefined) {
                    args.push(Sk.builtin.none.none$);
                    nones++;
                } else {
                    args.push(next);
                }
            }
            if (nones !== iterables.length) {
                combined.push(args);
            } else {
                // All iterables are done
                break;
            }
        }
        seq = new Sk.builtin.list(combined);
    }

    if (!Sk.builtin.checkIterable(seq)) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(seq) + "' object is not iterable");
    }

    return Sk.misceval.chain(
        Sk.misceval.iterFor(Sk.abstr.iter(seq), function (item) {
            if (fun === Sk.builtin.none.none$) {
                if (item instanceof Array) {
                    // With None function and multiple sequences,
                    // map should return a list of tuples
                    item = new Sk.builtin.tuple(item);
                }
                retval.push(item);
            } else {
                if (!(item instanceof Array)) {
                    // If there was only one iterable, convert to Javascript
                    // Array for call to apply.
                    item = [item];
                }

                return Sk.misceval.chain(Sk.misceval.callsimOrSuspendArray(fun, item), function (result) {
                    retval.push(result);
                });
            }
        }),
        function () {
            return new Sk.builtin.list(retval);
        }
    );
};

Sk.builtin.reduce = function reduce(fun, seq, initializer) {
    var item;
    var accum_value;
    var iter;
    if (!Sk.builtin.checkIterable(seq)) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(seq) + "' object is not iterable");
    }

    iter = Sk.abstr.iter(seq);
    if (initializer === undefined) {
        initializer = iter.tp$iternext();
        if (initializer === undefined) {
            throw new Sk.builtin.TypeError("reduce() of empty sequence with no initial value");
        }
    }
    accum_value = initializer;
    for (item = iter.tp$iternext(); item !== undefined; item = iter.tp$iternext()) {
        accum_value = Sk.misceval.callsimArray(fun, [accum_value, item]);
    }

    return accum_value;
};

/**
 *
 * @param {pyObject} iterable
 * @param {*=} cmp
 * @param {*=} key
 * @param {*=} reverse
 */
Sk.builtin.sorted = function sorted(iterable, cmp, key, reverse) {
    const lst = Sk.misceval.arrayFromIterable(iterable, true);
    return Sk.misceval.chain(lst, (L) => {
        L = new Sk.builtin.list(L);
        L.list$sort(cmp, key, reverse);
        return L;
    });
};

Sk.builtin.filter = function filter(fun, iterable) {
    var result;
    var iter, item;
    var retval;
    var ret;
    var add;
    var ctor;
    Sk.builtin.pyCheckArgsLen("filter", arguments.length, 2, 2);
    if (!Sk.builtin.checkIterable(iterable)) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(iterable) + "' object is not iterable");
    }
    ctor = function () {
        return [];
    };
    add = function (iter, item) {
        iter.push(item);
        return iter;
    };
    ret = function (iter) {
        return new Sk.builtin.list(iter);
    };

    if (iterable.ob$type === Sk.builtin.str) {
        ctor = function () {
            return new Sk.builtin.str("");
        };
        add = function (iter, item) {
            return iter.sq$concat(item);
        };
        ret = function (iter) {
            return iter;
        };
    } else if (iterable.ob$type === Sk.builtin.tuple) {
        ret = function (iter) {
            return new Sk.builtin.tuple(iter);
        };
    }

    retval = ctor();

    for (iter = Sk.abstr.iter(iterable), item = iter.tp$iternext(); item !== undefined; item = iter.tp$iternext()) {
        if (fun === Sk.builtin.none.none$) {
            result = new Sk.builtin.bool(item);
        } else {
            result = Sk.misceval.callsimArray(fun, [item]);
        }

        if (Sk.misceval.isTrue(result)) {
            retval = add(retval, item);
        }
    }

    return ret(retval);
};

Sk.builtin.hasattr = function hasattr(obj, pyName) {
    if (!Sk.builtin.checkString(pyName)) {
        throw new Sk.builtin.TypeError("hasattr(): attribute name must be string");
    }
    const res = Sk.misceval.tryCatch(
        () => obj.tp$getattr(pyName, true),
        (e) => {
            if (e instanceof Sk.builtin.AttributeError) {
                return undefined;
            } else {
                throw e;
            }
        }
    );
    return Sk.misceval.chain(res, (val) => (val === undefined ? Sk.builtin.bool.false$ : Sk.builtin.bool.true$));
};

Sk.builtin.pow = function pow(v, w, z) {
    // skulpt does support ternary slots
    if (z === undefined || Sk.builtin.checkNone(z)) {
        return Sk.abstr.numberBinOp(v, w, "Pow");
    }
    // only support a third argument if they're all the integers.
    if (!(Sk.builtin.checkInt(v) && Sk.builtin.checkInt(w) && Sk.builtin.checkInt(z))) {
        if (Sk.builtin.checkFloat(v) || Sk.builtin.checkComplex(v)) {
            return v.nb$power(w, z); // these slots for float and complex throw the correct errors
        }
        throw new Sk.builtin.TypeError(
            "unsupported operand type(s) for ** or pow(): '" + Sk.abstr.typeName(v) + "', '" + Sk.abstr.typeName(w) + "', '" + Sk.abstr.typeName(z) + "'"
        );
    }
    return v.nb$power(w, z);
};

Sk.builtin.quit = function quit(msg) {
    var s = new Sk.builtin.str(msg).v;
    throw new Sk.builtin.SystemExit(s);
};

Sk.builtin.issubclass = function issubclass(c1, c2) {
    if (!Sk.builtin.checkClass(c1)) {
        throw new Sk.builtin.TypeError("issubclass() arg 1 must be a class");
    }
    let c2_isClass = Sk.builtin.checkClass(c2);
    if (!c2_isClass && !(c2 instanceof Sk.builtin.tuple)) {
        throw new Sk.builtin.TypeError("issubclass() arg 2 must be a class or tuple of classes");
    }
    if (c2_isClass) {
        return c1.$isSubType(c2) ? Sk.builtin.bool.true$ : Sk.builtin.bool.false$;
    }
    // Handle tuple type argument
    for (let i = 0; i < c2.v.length; ++i) {
        if (Sk.misceval.isTrue(Sk.builtin.issubclass(c1, c2.v[i]))) {
            return Sk.builtin.bool.true$;
        }
    }
    return Sk.builtin.bool.false$;
};

Sk.builtin.globals = function globals () {
    var i, unmangled;
    var ret = new Sk.builtin.dict([]);
    for (i in Sk["globals"]) {
        unmangled = Sk.unfixReserved(i);
        ret.mp$ass_subscript(new Sk.builtin.str(unmangled), Sk["globals"][i]);
    }

    return ret;
};

Sk.builtin.divmod = function divmod(a, b) {
    return Sk.abstr.numberBinOp(a, b, "DivMod");
};

/**
 * Convert a value to a “formatted” representation, as controlled by format_spec. The interpretation of format_spec
 * will depend on the type of the value argument, however there is a standard formatting syntax that is used by most
 * built-in types: Format Specification Mini-Language.
 */
Sk.builtin.format = function format(value, format_spec) {
    return Sk.abstr.objectFormat(value, format_spec);
};

const idMap = new WeakMap();
let _id = 0;
Sk.builtin.id = function (obj) {
    const id = idMap.get(obj);
    if (id !== undefined) {
        return new Sk.builtin.int_(id);
    }
    idMap.set(obj, _id);
    return new Sk.builtin.int_(_id++);
};

Sk.builtin.bytearray = function bytearray() {
    throw new Sk.builtin.NotImplementedError("bytearray is not yet implemented");
};

Sk.builtin.callable = function callable(obj) {
    // check num of args

    if (Sk.builtin.checkCallable(obj)) {
        return Sk.builtin.bool.true$;
    }
    return Sk.builtin.bool.false$;
};

Sk.builtin.delattr = function delattr(obj, attr) {
    return Sk.builtin.setattr(obj, attr, undefined);
};

Sk.builtin.execfile = function execfile() {
    throw new Sk.builtin.NotImplementedError("execfile is not yet implemented");
};

Sk.builtin.help = function help() {
    throw new Sk.builtin.NotImplementedError("help is not yet implemented");
};

Sk.builtin.iter = function iter(obj, sentinel) {
    if (arguments.length === 1) {
        return Sk.abstr.iter(obj);
    } else {
        return Sk.abstr.iter(new Sk.builtin.callable_iter_(obj, sentinel));
    }
};

Sk.builtin.locals = function locals() {
    throw new Sk.builtin.NotImplementedError("locals is not yet implemented");
};
Sk.builtin.memoryview = function memoryview() {
    throw new Sk.builtin.NotImplementedError("memoryview is not yet implemented");
};

Sk.builtin.next_ = function next_(iter, default_) {
    if (!iter.tp$iternext) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(iter) + "' object is not an iterator");
    }
    return Sk.misceval.chain(iter.tp$iternext(true), (nxt) => {
        if (nxt === undefined) {
            if (default_) {
                return default_;
            }
            const v = iter.gi$ret;
            // gi$ret is the original value that was thrown by the StopIteration
            // (or returned by a generator)
            // We've now lost the original StopIteration
            // We make the assumption that it was probably called like
            // raise StopIteration # or  StopIteration()
            // rather than
            // raise StopIteration(None)
            if (v !== undefined && v !== Sk.builtin.none.none$) {
                throw new Sk.builtin.StopIteration(v);
            } else {
                throw new Sk.builtin.StopIteration();
            }
        }
        return nxt;
    });
};

Sk.builtin.reload = function reload() {
    throw new Sk.builtin.NotImplementedError("reload is not yet implemented");
};
Sk.builtin.vars = function vars() {
    throw new Sk.builtin.NotImplementedError("vars is not yet implemented");
};

Sk.builtin.apply_ = function apply_() {
    throw new Sk.builtin.NotImplementedError("apply is not yet implemented");
};
Sk.builtin.buffer = function buffer_() {
    throw new Sk.builtin.NotImplementedError("buffer is not yet implemented");
};
Sk.builtin.coerce = function coerce() {
    throw new Sk.builtin.NotImplementedError("coerce is not yet implemented");
};
Sk.builtin.intern = function intern() {
    throw new Sk.builtin.NotImplementedError("intern is not yet implemented");
};

/* PyAngelo Functionality */
Sk.builtin.setCanvasSize = function setCanvasSize(w, h, yAxisMode) {
    Sk.builtin.pyCheckArgsLen("setCanvasSize", arguments.length, 2, 3);
    w = Sk.ffi.remapToJs(w);
    h = Sk.ffi.remapToJs(h);
    yAxisMode = Sk.ffi.remapToJs(yAxisMode);
    if (!Sk.builtin.checkInt(w)) {
        throw new Sk.builtin.TypeError("Width must be an integer");
    }
    if (!Sk.builtin.checkInt(h)) {
        throw new Sk.builtin.TypeError("Height must be an integer");
    }
    if (!Sk.builtin.checkInt(yAxisMode)) {
        throw new Sk.builtin.TypeError("yAxisMode must be an integer");
    }

    // Change the actual canvas
    Sk.PyAngelo.canvas.style.display = "block";
    Sk.PyAngelo.canvas.width = w;
    Sk.PyAngelo.canvas.height = h;
    Sk.PyAngelo.canvas.focus();

    // Update the global variables
    Sk.builtins.width = new Sk.builtin.int_(w);
    Sk.builtins.height = new Sk.builtin.int_(h);

    // Set up the y axis
    if (yAxisMode === 1) {
        Sk.PyAngelo.ctx.transform(1, 0, 0, -1, 0, h);
        Sk.builtins._yAxisMode = yAxisMode;
    } else {
        Sk.PyAngelo.ctx.transform(1, 0, 0, 1, 0, 0);
        Sk.builtins._yAxisMode = 2;
    }
};

Sk.builtin.setConsoleSize = function setConsoleSize(size) {
    Sk.builtin.pyCheckArgsLen("setConsoleSize", arguments.length, 1, 1);
    if (!Sk.builtin.checkInt(size)) {
        throw new Sk.builtin.TypeError("Size must be an integer");
    }
    size = Sk.ffi.remapToJs(size);
    if (size >= 100 && size <= 2000) {
        Sk.PyAngelo.console.style.height = size + "px";
    }
};

Sk.builtin.noCanvas = function noCanvas() {
    // Change the actual canvas
    Sk.PyAngelo.canvas.style.display = "none";
    Sk.PyAngelo.canvas.width = 0;
    Sk.PyAngelo.canvas.height = 0;

    // Update the global variables
    Sk.builtins.width = new Sk.builtin.int_(0);
    Sk.builtins.height = new Sk.builtin.int_(0);
};

Sk.builtin.focusCanvas = function focusCanvas() {
    Sk.PyAngelo.canvas.focus();
};

Sk.builtin.background = function background(r, g, b, a) {
    Sk.builtin.pyCheckArgsLen("background", arguments.length, 0, 4);
    const fs = Sk.PyAngelo.ctx.fillStyle;
    Sk.PyAngelo.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    Sk.PyAngelo.ctx.fillRect(0, 0, Sk.PyAngelo.canvas.width, Sk.PyAngelo.canvas.height);
    Sk.PyAngelo.ctx.fillStyle = fs;
};

Sk.builtin.text = function text(text, x, y, fontSize, fontName) {
    Sk.builtin.pyCheckArgsLen("text", arguments.length, 3, 5);
    text = Sk.ffi.remapToJs(text);
    x = Sk.ffi.remapToJs(x);
    y = Sk.ffi.remapToJs(y);
    let fs = Sk.PyAngelo.ctx.font;
    Sk.PyAngelo.ctx.font = Sk.ffi.remapToJs(fontSize).toString() + "px " + Sk.ffi.remapToJs(fontName);
    Sk.PyAngelo.ctx.textBaseline = "top";
    if (Sk.ffi.remapToJs(Sk.builtins._yAxisMode) === 1) {
        let textMetrics = Sk.PyAngelo.ctx.measureText(text);
        const height = Math.abs(textMetrics.actualBoundingBoxAscent) + Math.abs(textMetrics.actualBoundingBoxDescent);
        Sk.PyAngelo.ctx.save();
        Sk.PyAngelo.ctx.translate(x, y);
        Sk.PyAngelo.ctx.transform(1, 0, 0, -1, 0, height);
        Sk.PyAngelo.ctx.fillText(text, 0, 0);
        Sk.PyAngelo.ctx.restore();
    } else {
        Sk.PyAngelo.ctx.fillText(text, x, y);
    }
    Sk.PyAngelo.ctx.font = fs;
};

Sk.builtin.saveState = function saveState() {
    Sk.PyAngelo.ctx.save();
};

Sk.builtin.restoreState = function restoreState() {
    Sk.PyAngelo.ctx.restore();
};

Sk.builtin.translate = function translate(x, y) {
    Sk.builtin.pyCheckArgsLen("translate", arguments.length, 2, 2);
    Sk.PyAngelo.ctx.translate(x, y);
};

Sk.builtin.angleMode = function angleMode(mode) {
    Sk.builtin.pyCheckArgsLen("angleMode", arguments.length, 1, 1);
    let m = Sk.ffi.remapToJs(mode);
    if (m === 1 || m === 2) {
        Sk.builtins._angleModeValue = new Sk.builtin.int_(m);
    }
};

Sk.builtin.rectMode = function rectMode(mode) {
    Sk.builtin.pyCheckArgsLen("rectMode", arguments.length, 1, 1);
    let m = Sk.ffi.remapToJs(mode);
    if (m === 1 || m === 2 || m === 3) {
        Sk.builtins._rectMode = new Sk.builtin.int_(m);
    }
};

Sk.builtin.circleMode = function circleMode(mode) {
    Sk.builtin.pyCheckArgsLen("circleMode", arguments.length, 1, 1);
    let m = Sk.ffi.remapToJs(mode);
    if (m === 1 || m === 3) {
        Sk.builtins._circleMode = new Sk.builtin.int_(m);
    }
};

Sk.builtin.rotate = function rotate(angle) {
    Sk.builtin.pyCheckArgsLen("rotate", arguments.length, 1, 1);
    let a = Sk.ffi.remapToJs(angle);
    // Convert to radians if in degrees
    if (Sk.ffi.remapToJs(Sk.builtins._angleModeValue) != 1) {
        a = Sk.ffi.remapToJs(Sk.builtins.PI)/180 * a;
    }
    Sk.PyAngelo.ctx.rotate(a);
};

Sk.builtin.applyMatrix = function applyMatrix(a, b, c, d, e, f) {
    Sk.PyAngelo.ctx.transform(Sk.ffi.remapToJs(a), Sk.ffi.remapToJs(b), Sk.ffi.remapToJs(c), Sk.ffi.remapToJs(d), Sk.ffi.remapToJs(e), Sk.ffi.remapToJs(f));
};

Sk.builtin.shearX = function shearX(angle) {
    let a = Sk.ffi.remapToJs(angle);
    // Convert to radians if in degrees
    if (Sk.ffi.remapToJs(Sk.builtins._angleModeValue) != 1) {
        a = Sk.ffi.remapToJs(Sk.builtins.PI)/180 * a;
    }
    Sk.PyAngelo.ctx.transform(1, 0, Math.tan(a), 1, 0, 0);
};

Sk.builtin.shearY = function shearY(angle) {
    let a = Sk.ffi.remapToJs(angle);
    // Convert to radians if in degrees
    if (Sk.ffi.remapToJs(Sk.builtins._angleModeValue) != 1) {
        a = Sk.ffi.remapToJs(Sk.builtins.PI)/180 * a;
    }
    Sk.PyAngelo.ctx.transform(1, Math.tan(a), 0, 1, 0, 0);
};

Sk.builtin.strokeWeight = function strokeWeight(weight) {
    Sk.builtin.pyCheckArgsLen("strokeWeight", arguments.length, 1, 1);
    Sk.PyAngelo.ctx.lineWidth = Sk.ffi.remapToJs(weight);
};

Sk.builtin.fill = function fill(r, g, b, a) {
    Sk.builtin.pyCheckArgsLen("fill", arguments.length, 0, 4);
    Sk.PyAngelo.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    Sk.builtins._doFill = Sk.builtin.bool.true$;
};

Sk.builtin.noFill = function noFill() {
    Sk.builtins._doFill = Sk.builtin.bool.false$;
};

Sk.builtin.stroke = function stroke(r, g, b, a) {
    Sk.builtin.pyCheckArgsLen("stroke", arguments.length, 0, 4);
    Sk.PyAngelo.ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    Sk.builtins._doStroke = Sk.builtin.bool.true$;
};

Sk.builtin.noStroke = function noStroke() {
    Sk.builtins._doStroke = Sk.builtin.bool.false$;
};

Sk.builtin.line = function line(x1, y1, x2, y2) {
    Sk.builtin.pyCheckArgsLen("line", arguments.length, 4, 4);
    Sk.PyAngelo.ctx.beginPath();
    Sk.PyAngelo.ctx.moveTo(x1, y1);
    Sk.PyAngelo.ctx.lineTo(x2, y2);
    if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
        Sk.PyAngelo.ctx.stroke();
    }
};

Sk.builtin.circle = function circle(x, y, radius) {
    Sk.builtin.pyCheckArgsLen("circle", arguments.length, 3, 3);
    x = Sk.ffi.remapToJs(x);
    y = Sk.ffi.remapToJs(y);
    radius = Sk.ffi.remapToJs(radius);
    if (Sk.ffi.remapToJs(Sk.builtins._circleMode) === 1) {
        x = x + radius;
        y = y + radius;
    }
    Sk.PyAngelo.ctx.beginPath();
    Sk.PyAngelo.ctx.arc(x, y, radius, 0, Sk.ffi.remapToJs(Sk.builtins.TWO_PI));
    if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
        Sk.PyAngelo.ctx.stroke();
    }
    if (Sk.ffi.remapToJs(Sk.builtins._doFill) === true) {
        Sk.PyAngelo.ctx.fill();
    }
};

Sk.builtin.ellipse = function ellipse(x, y, radiusX, radiusY) {
    Sk.builtin.pyCheckArgsLen("ellipse", arguments.length, 4, 4);
    x = Sk.ffi.remapToJs(x);
    y = Sk.ffi.remapToJs(y);
    radiusX = Sk.ffi.remapToJs(radiusX);
    radiusY = Sk.ffi.remapToJs(radiusY);
    if (Sk.ffi.remapToJs(Sk.builtins._circleMode) === 1) {
        x = x + radiusX;
        y = y + radiusY;
    }
    Sk.PyAngelo.ctx.beginPath();
    Sk.PyAngelo.ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Sk.ffi.remapToJs(Sk.builtins.TWO_PI));
    if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
        Sk.PyAngelo.ctx.stroke();
    }
    if (Sk.ffi.remapToJs(Sk.builtins._doFill) === true) {
        Sk.PyAngelo.ctx.fill();
    }
};

Sk.builtin.arc = function arc(x, y, radiusX, radiusY, startAngle, endAngle) {
    Sk.builtin.pyCheckArgsLen("arc", arguments.length, 6, 6);
    x = Sk.ffi.remapToJs(x);
    y = Sk.ffi.remapToJs(y);
    radiusX = Sk.ffi.remapToJs(radiusX);
    radiusY = Sk.ffi.remapToJs(radiusY);
    startAngle = Sk.ffi.remapToJs(startAngle);
    endAngle = Sk.ffi.remapToJs(endAngle);
    if (Sk.ffi.remapToJs(Sk.builtins._circleMode) === 1) {
        x = x + radiusX;
        y = y + radiusY;
    }
    // Convert to radians if in degrees
    if (Sk.ffi.remapToJs(Sk.builtins._angleModeValue) != 1) {
        startAngle = Sk.ffi.remapToJs(Sk.builtins.PI)/180 * startAngle;
        endAngle = Sk.ffi.remapToJs(Sk.builtins.PI)/180 * endAngle;
    }
    Sk.PyAngelo.ctx.beginPath();
    Sk.PyAngelo.ctx.ellipse(x, y, radiusX, radiusY, 0, startAngle, endAngle);
    if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
        Sk.PyAngelo.ctx.stroke();
    }
    if (Sk.ffi.remapToJs(Sk.builtins._doFill) === true) {
        Sk.PyAngelo.ctx.fill();
    }
};

Sk.builtin.triangle = function triangle(x1, y1, x2, y2, x3, y3) {
    Sk.builtin.pyCheckArgsLen("triangle", arguments.length, 6, 6);
    Sk.PyAngelo.ctx.beginPath();
    Sk.PyAngelo.ctx.moveTo(x1, y1);
    Sk.PyAngelo.ctx.lineTo(x2, y2);
    Sk.PyAngelo.ctx.lineTo(x3, y3);
    Sk.PyAngelo.ctx.closePath();
    if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
        Sk.PyAngelo.ctx.stroke();
    }
    if (Sk.ffi.remapToJs(Sk.builtins._doFill) === true) {
        Sk.PyAngelo.ctx.fill();
    }
};

Sk.builtin.quad = function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
    Sk.builtin.pyCheckArgsLen("quad", arguments.length, 8, 8);
    Sk.PyAngelo.ctx.beginPath();
    Sk.PyAngelo.ctx.moveTo(x1, y1);
    Sk.PyAngelo.ctx.lineTo(x2, y2);
    Sk.PyAngelo.ctx.lineTo(x3, y3);
    Sk.PyAngelo.ctx.lineTo(x4, y4);
    Sk.PyAngelo.ctx.closePath();
    if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
        Sk.PyAngelo.ctx.stroke();
    }
    if (Sk.ffi.remapToJs(Sk.builtins._doFill) === true) {
        Sk.PyAngelo.ctx.fill();
    }
};

Sk.builtin.point = function point(x, y) {
    Sk.builtin.pyCheckArgsLen("point", arguments.length, 2, 2);
    if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
        const s = Sk.PyAngelo.ctx.strokeStyle;
        const f = Sk.PyAngelo.ctx.fillStyle;
        Sk.PyAngelo.ctx.fillStyle = s;
        Sk.PyAngelo.ctx.beginPath();
        if (Sk.PyAngelo.ctx.lineWidth > 1) {
            Sk.PyAngelo.ctx.arc(x, y, Sk.PyAngelo.ctx.lineWidth / 2, 0, Sk.ffi.remapToJs(Sk.builtins.TWO_PI));
        } else {
            Sk.builtin.rect(x, y, 1, 1);
        }
        if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
            Sk.PyAngelo.ctx.stroke();
        }
    }
};

Sk.builtin.rect = function rect(x, y, w, h) {
    Sk.builtin.pyCheckArgsLen("rect", arguments.length, 4, 4);
    x = Sk.ffi.remapToJs(x);
    y = Sk.ffi.remapToJs(y);
    w = Sk.ffi.remapToJs(w);
    h = Sk.ffi.remapToJs(h);

    if (Sk.ffi.remapToJs(Sk.builtins._rectMode) == 2) {
        w = w - x;
        h = h - y;
    } else if (Sk.ffi.remapToJs(Sk.builtins._rectMode) == 3) {
        x = x - w * 0.5;
        y = y - h * 0.5;
    }
    Sk.PyAngelo.ctx.beginPath();
    Sk.PyAngelo.ctx.rect(x, y, w, h);
    if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
        Sk.PyAngelo.ctx.stroke();
    }
    if (Sk.ffi.remapToJs(Sk.builtins._doFill) === true) {
        Sk.PyAngelo.ctx.fill();
    }
};

Sk.builtin.beginShape = function beginShape() {
    Sk.builtins._vertex = [];
};

Sk.builtin.vertex = function vertex(x, y) {
    Sk.builtin.pyCheckArgsLen("vertex", arguments.length, 2, 2);
    Sk.builtins._vertex.push([x, y]);
};

Sk.builtin.endShape = function endShape(mode) {
    Sk.builtin.pyCheckArgsLen("endShape", arguments.length, 0, 1);
    if (Sk.builtins._vertex.length == 0) {
        return;
    } else if (Sk.builtins._vertex.length == 1) {
        Sk.builtin.point(Sk.builtins._vertex[0][0], Sk.builtins._vertex[0][1]);
        return;
    }
    Sk.PyAngelo.ctx.beginPath();
    Sk.PyAngelo.ctx.moveTo(Sk.builtins._vertex[0][0], Sk.builtins._vertex[0][1]);
    let vLen = Sk.builtins._vertex.length;
    for (let i = 1; i < vLen; i++) {
        Sk.PyAngelo.ctx.lineTo(Sk.builtins._vertex[i][0], Sk.builtins._vertex[i][1]);
    }
    if (Sk.ffi.remapToJs(mode) === 1) {
        Sk.PyAngelo.ctx.closePath();
    }
    if (Sk.ffi.remapToJs(Sk.builtins._doStroke) === true) {
        Sk.PyAngelo.ctx.stroke();
    }
    if (Sk.ffi.remapToJs(Sk.builtins._doFill) === true) {
        Sk.PyAngelo.ctx.fill();
    }
    Sk.builtins._vertex = [];
};

Sk.builtin.loadImage = function loadImage(file) {
    Sk.builtin.pyCheckArgsLen("loadImage", arguments.length, 1, 1);
    let prom = new Promise(function (resolve, reject) {
        let img = new Image();
        img.onload = function(e) {
            Sk.PyAngelo.images[e.target.file] = e.target;
            resolve(e.target.file);
        };
        img.onerror = function(e) {
            reject(Error("Check your have uploaded the file " + e.target.file + " to your sketch. The line number error that follows is not accurate"));
        };
        img.file = file;
        img.src = file;
    });
    let susp = new Sk.misceval.Suspension();

    susp.resume = function() {
        if (susp.data.error) {
            throw new Sk.builtin.IOError(susp.data["error"].message);
            // throw susp.data.error;
        }

        return susp.data.result;
    };

    susp.data = {
        type: "Sk.promise",
        promise: prom
    };

    return susp;
};

Sk.builtin.image = function image(image, x, y, width, height, opacity) {
    Sk.builtin.pyCheckArgsLen("image", arguments.length, 3, 6);
    image = Sk.ffi.remapToJs(image);
    x = Sk.ffi.remapToJs(x);
    y = Sk.ffi.remapToJs(y);
    width = Sk.ffi.remapToJs(width);
    height = Sk.ffi.remapToJs(height);
    opacity = Sk.ffi.remapToJs(opacity);

    if (Sk.PyAngelo.images[image] === undefined) {
        throw new Sk.builtin.IOError("Image " + image + " has not been loaded");
    }

    if (width === null) {
        width = Sk.PyAngelo.images[image].naturalWidth;
    }
    if (height === null) {
        height = Sk.PyAngelo.images[image].naturalHeight;
    }

    let ga = Sk.PyAngelo.ctx.globalAlpha;
    if (opacity !== null) {
        if (opacity > 1.0) {
            opacity = 1.0;
        } else if (opacity < 0.0) {
            opacity = 0.0;
        }
        Sk.PyAngelo.ctx.globalAlpha = opacity;
    }
    if (Sk.ffi.remapToJs(Sk.builtins._yAxisMode) === 1) {
        Sk.PyAngelo.ctx.save();
        Sk.PyAngelo.ctx.translate(x, y);
        Sk.PyAngelo.ctx.transform(1, 0, 0, -1, 0, height);
        Sk.PyAngelo.ctx.drawImage(Sk.PyAngelo.images[image], 0, 0, width, height);
        Sk.PyAngelo.ctx.restore();
    } else {
        Sk.PyAngelo.ctx.drawImage(Sk.PyAngelo.images[image], x, y, width, height);
    }
    Sk.PyAngelo.ctx.globalAlpha = ga;
};

Sk.builtin._getImageHeight = function _getImageHeight(image) {
    Sk.builtin.pyCheckArgsLen("_getImageHeight", arguments.length, 1, 1);
    return Sk.ffi.remapToPy(Sk.PyAngelo.images[image].naturalHeight);
};

Sk.builtin._getImageWidth = function _getImageWidth(image) {
    Sk.builtin.pyCheckArgsLen("_getImageWidth", arguments.length, 1, 1);
    return Sk.ffi.remapToPy(Sk.PyAngelo.images[image].naturalWidth);
};

Sk.builtin._getFont = function _getFont() {
    return Sk.ffi.remapToPy(Sk.PyAngelo.ctx.font);
};

Sk.builtin._setFont = function _setFont(font) {
    Sk.builtin.pyCheckArgsLen("_setFont", arguments.length, 1, 1);
    font = Sk.ffi.remapToJs(font);
    Sk.PyAngelo.ctx.font = font;
};

Sk.builtin._measureText = function _measureText(text) {
    Sk.builtin.pyCheckArgsLen("_measureText", arguments.length, 1, 1);
    Sk.PyAngelo.ctx.textBaseline = "top";
    let textMetrics = Sk.PyAngelo.ctx.measureText(Sk.ffi.remapToJs(text));
    return Sk.ffi.remapToPy(textMetrics);
};

Sk.builtin._getFillStyle = function _getFillStyle() {
    return Sk.ffi.remapToPy(Sk.PyAngelo.ctx.fillStyle);
};

Sk.builtin._setFillStyle = function _setFillStyle(style) {
    Sk.builtin.pyCheckArgsLen("_setFillStyle", arguments.length, 1, 1);
    style = Sk.ffi.remapToJs(style);
    Sk.PyAngelo.ctx.fillStyle = style;
};

Sk.builtin._getStrokeStyle = function _getStrokeStyle() {
    return Sk.ffi.remapToPy(Sk.PyAngelo.ctx.strokeStyle);
};

Sk.builtin._setStrokeStyle = function _setStrokeStyle(style) {
    Sk.builtin.pyCheckArgsLen("_setStrokeStyle", arguments.length, 1, 1);
    style = Sk.ffi.remapToJs(style);
    Sk.PyAngelo.ctx.strokeStyle = style;
};

Sk.builtin._getLineWidth = function _getLineWidth() {
    return Sk.ffi.remapToPy(Sk.PyAngelo.ctx.lineWidth);
};

Sk.builtin._setLineWidth = function _setLineWidth(width) {
    Sk.builtin.pyCheckArgsLen("_setLineWidth", arguments.length, 1, 1);
    width = Sk.ffi.remapToJs(width);
    Sk.PyAngelo.ctx.lineWidth = width;
};

Sk.builtin._getDoStroke = function _getDoStroke() {
    return Sk.ffi.remapToPy(Sk.builtins._doStroke);
};

Sk.builtin._setDoStroke = function _setDoStroke(value) {
    Sk.builtin.pyCheckArgsLen("_setDoStroke", arguments.length, 1, 1);
    value = Sk.ffi.remapToJs(value);
    if (value) {
        Sk.builtins._doStroke = Sk.builtin.bool.true$;
    } else {
        Sk.builtins._doStroke = Sk.builtin.bool.false$;
    }
};

Sk.builtin.loadSound = function loadSound(filename) {
    Sk.builtin.pyCheckArgsLen("loadSound", arguments.length, 1, 1);
    filename = Sk.ffi.remapToJs(filename);
    let sound = new Howl({"src": [filename]});
    Sk.PyAngelo.sounds[filename] = sound;

    return Sk.ffi.remapToPy(filename);
};

Sk.builtin.playSound = function playSound(sound, loop, volume) {
    Sk.builtin.pyCheckArgsLen("playSound", arguments.length, 1, 3);
    sound = Sk.ffi.remapToJs(sound);
    loop = Sk.ffi.remapToJs(loop);
    volume = Sk.ffi.remapToJs(volume);
    if (!Sk.PyAngelo.sounds.hasOwnProperty(sound)) {
        sound = Sk.ffi.remapToJs(Sk.misceval.callsim(Sk.builtin.loadSound, sound));
    }
    Sk.PyAngelo.sounds[sound].loop(loop);
    Sk.PyAngelo.sounds[sound].volume(volume);
    Sk.PyAngelo.sounds[sound].play();
};

Sk.builtin.stopSound = function stopSound(sound) {
    Sk.builtin.pyCheckArgsLen("stopSound", arguments.length, 1, 1);
    sound = Sk.ffi.remapToJs(sound);
    if (Sk.PyAngelo.sounds.hasOwnProperty(sound)) {
        Sk.PyAngelo.sounds[sound].stop();
    }
};

Sk.builtin.pauseSound = function pauseSound(sound) {
    Sk.builtin.pyCheckArgsLen("pauseSound", arguments.length, 1, 1);
    sound = Sk.ffi.remapToJs(sound);
    if (Sk.PyAngelo.sounds.hasOwnProperty(sound)) {
        Sk.PyAngelo.sounds[sound].pause();
    }
};

Sk.builtin.stopAllSounds = function stopAllSounds() {
    for (const sound in Sk.PyAngelo.sounds) {
        Sk.PyAngelo.sounds[sound].stop();
    }
};

Sk.builtin._getPixelColour = function _getPixelColour(x, y) {
    Sk.builtin.pyCheckArgsLen("_getPixelColour", arguments.length, 2, 2);
    x = Sk.ffi.remapToJs(x);
    y = Sk.ffi.remapToJs(y);
    const pixel = Sk.PyAngelo.ctx.getImageData(x, y, 1, 1);
    return Sk.ffi.remapToPy(pixel.data);
};

Sk.builtin.isKeyPressed = function isKeyPressed(code) {
    Sk.builtin.pyCheckArgsLen("isKeyPressed", arguments.length, 1, 1);
    code = Sk.ffi.remapToJs(code);
    if (!Sk.PyAngelo.keys.hasOwnProperty(code)) {
        return Sk.builtin.bool.false$;
    }
    return Sk.ffi.remapToPy(Sk.PyAngelo.keys[code]);
};

Sk.builtin.wasKeyPressed = function wasKeyPressed(code) {
    Sk.builtin.pyCheckArgsLen("wasKeyPressed", arguments.length, 1, 1);
    code = Sk.ffi.remapToJs(code);
    if (!Sk.PyAngelo.keyWasPressed.hasOwnProperty(code)) {
        return Sk.builtin.bool.false$;
    } else if (Sk.PyAngelo.keyWasPressed[code]) {
        Sk.PyAngelo.keyWasPressed[code] = false;
        return Sk.builtin.bool.true$;
    } else {
        return Sk.builtin.bool.false$;
    }
};

Sk.builtin.dist = function dist(x1, y1, x2, y2) {
    Sk.builtin.pyCheckArgsLen("dist", arguments.length, 4, 4);
    x1 = Sk.ffi.remapToJs(x1);
    y1 = Sk.ffi.remapToJs(y1);
    x2 = Sk.ffi.remapToJs(x2);
    y2 = Sk.ffi.remapToJs(y2);
    return Sk.ffi.remapToPy(Math.sqrt((x2 - x1)**2 + (y2 - y1)**2));
};

Sk.builtin.setTextColour = function setTextColour(colour) {
    Sk.builtin.pyCheckArgsLen("setTextColour", arguments.length, 1, 1);
    colour = Sk.ffi.remapToJs(colour);
    if (colour === 0) {
        Sk.PyAngelo.textColour = "rgba(181, 137, 0, 1)";
    } else if (colour === 1) {
        Sk.PyAngelo.textColour = "rgba(203, 75, 22, 1)";
    } else if (colour === 2) {
        Sk.PyAngelo.textColour = "rgba(220, 50, 47, 1)";
    } else if (colour === 3) {
        Sk.PyAngelo.textColour = "rgba(211, 54, 130, 1)";
    } else if (colour === 4) {
        Sk.PyAngelo.textColour = "rgba(108, 113, 196, 1)";
    } else if (colour === 5) {
        Sk.PyAngelo.textColour = "rgba(38, 139, 210, 1)";
    } else if (colour === 6) {
        Sk.PyAngelo.textColour = "rgba(42, 161, 152, 1)";
    } else if (colour === 7) {
        Sk.PyAngelo.textColour = "rgba(133, 153, 0, 1)";
    } else if (colour === 8) {
        Sk.PyAngelo.textColour = "rgba(253, 246, 227, 1)";
    } else if (colour === 9) {
        Sk.PyAngelo.textColour = "rgba(147, 161, 161, 1)";
    } else if (colour === 10) {
        Sk.PyAngelo.textColour = "rgba(0, 0, 0, 1)";
    }
};

Sk.builtin.setHighlightColour = function setHighlightColour(colour) {
    Sk.builtin.pyCheckArgsLen("setHighlightColour", arguments.length, 1, 1);
    colour = Sk.ffi.remapToJs(colour);
    if (colour === 0) {
        Sk.PyAngelo.highlightColour = "rgba(181, 137, 0, 1)";
    } else if (colour === 1) {
        Sk.PyAngelo.highlightColour = "rgba(203, 75, 22, 1)";
    } else if (colour === 2) {
        Sk.PyAngelo.highlightColour = "rgba(220, 50, 47, 1)";
    } else if (colour === 3) {
        Sk.PyAngelo.highlightColour = "rgba(211, 54, 130, 1)";
    } else if (colour === 4) {
        Sk.PyAngelo.highlightColour = "rgba(108, 113, 196, 1)";
    } else if (colour === 5) {
        Sk.PyAngelo.highlightColour = "rgba(38, 139, 210, 1)";
    } else if (colour === 6) {
        Sk.PyAngelo.highlightColour = "rgba(42, 161, 152, 1)";
    } else if (colour === 7) {
        Sk.PyAngelo.highlightColour = "rgba(133, 153, 0, 1)";
    } else if (colour === 8) {
        Sk.PyAngelo.highlightColour = "rgba(253, 246, 227, 1)";
    } else if (colour === 9) {
        Sk.PyAngelo.highlightColour = "rgba(147, 161, 161, 1)";
    } else if (colour === 10) {
        Sk.PyAngelo.highlightColour = "rgba(0, 0, 0, 1)";
    }
};

Sk.builtin.clear = function clear(colour) {
    Sk.builtin.pyCheckArgsLen("clear", arguments.length, 0, 1);
    Sk.PyAngelo.console.innerHTML = "";
    colour = Sk.ffi.remapToJs(colour);
    if (colour === 0) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(181, 137, 0, 1)";
        Sk.PyAngelo.highlightColour = "rgba(181, 137, 0, 1)";
    } else if (colour === 1) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(203, 75, 22, 1)";
        Sk.PyAngelo.highlightColour = "rgba(203, 75, 22, 1)";
    } else if (colour === 2) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(220, 50, 47, 1)";
        Sk.PyAngelo.highlightColour = "rgba(220, 50, 47, 1)";
    } else if (colour === 3) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(211, 54, 130, 1)";
        Sk.PyAngelo.highlightColour = "rgba(211, 54, 130, 1)";
    } else if (colour === 4) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(108, 113, 196, 1)";
        Sk.PyAngelo.highlightColour = "rgba(108, 113, 196, 1)";
    } else if (colour === 5) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(38, 139, 210, 1)";
        Sk.PyAngelo.highlightColour = "rgba(38, 139, 210, 1)";
    } else if (colour === 6) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(42, 161, 152, 1)";
        Sk.PyAngelo.highlightColour = "rgba(42, 161, 152, 1)";
    } else if (colour === 7) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(133, 153, 0, 1)";
        Sk.PyAngelo.highlightColour = "rgba(133, 153, 0, 1)";
    } else if (colour === 8) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(253, 246, 227, 1)";
        Sk.PyAngelo.highlightColour = "rgba(253, 246, 227, 1)";
    } else if (colour === 9) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(147, 161, 161, 1)";
        Sk.PyAngelo.highlightColour = "rgba(147, 161, 161, 1)";
    } else if (colour === 10) {
        Sk.PyAngelo.console.style.backgroundColor = "rgba(0, 0, 0, 1)";
        Sk.PyAngelo.highlightColour = "rgba(0, 0, 0, 1)";
    }
};

Sk.builtin.sleep = function sleep(delay) {
    Sk.builtin.pyCheckArgsLen("sleep", arguments.length, 1, 1);
    Sk.builtin.pyCheckType("delay", "float", Sk.builtin.checkNumber(delay));

    return new Sk.misceval.promiseToSuspension(new Promise(function(resolve) {
        Sk.setTimeout(function() {
            resolve(Sk.builtin.none.none$);
        }, Sk.ffi.remapToJs(delay)*1000);
    }));
};

/*
 Sk.builtinFiles = {};
 Sk.builtin.read = function read(x) {
 if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
 throw "File not found: '" + x + "'";
 return Sk.builtinFiles["files"][x];
 };
 Sk.builtinFiles = undefined;
 */
