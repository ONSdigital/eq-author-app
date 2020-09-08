(window.webpackJsonp = window.webpackJsonp || []).push([
  [0],
  {
    1: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("ERkP");
    },
    10: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("vrRf");
    },
    105: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("kvVz");
    },
    106: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("+wNj");
    },
    107: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("5o43");
    },
    108: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("DfhM");
    },
    11: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("7x/C");
    },
    116: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("LJOr");
    },
    117: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("pu3o");
    },
    12: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("M+/F");
    },
    14: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("plBw");
    },
    147: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("3yYM");
    },
    15: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("DZ+c");
    },
    150: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("LqLs");
    },
    151: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("3voH");
    },
    16: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("87if");
    },
    162: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("6U7i");
    },
    163: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("Cm4o");
    },
    164: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("j4Sf");
    },
    165: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("LUwd");
    },
    166: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("OZaJ");
    },
    17: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("lTEL");
    },
    18: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("kYxP");
    },
    19: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("z84I");
    },
    2: function(module, exports) {
      module.exports = storybook_docs_dll;
    },
    20: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("2G9S");
    },
    21: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("aLgo");
    },
    215: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("W/Kd");
    },
    22: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("cARO");
    },
    220: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("+kY7");
    },
    224: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("5878");
    },
    23: function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__(3);
      var delegated_prop_typesfrom_dll_reference_storybook_docs_dll = __webpack_require__(
          28
        ),
        delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default = __webpack_require__.n(
          delegated_prop_typesfrom_dll_reference_storybook_docs_dll
        ),
        styled_components_browser_esm = __webpack_require__(25),
        polished_esmfrom_dll_reference_storybook_docs_dll = __webpack_require__(
          27
        ),
        propTypes = {
          variant: delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default.a.oneOf(
            [
              "primary",
              "secondary",
              "tertiary",
              "tertiary-light",
              "positive",
              "negative",
              "greyed",
              "navigation",
              "navigation-modal",
              "navigation-on",
              "signout",
            ]
          ),
          small:
            delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default.a
              .bool,
          medium:
            delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default.a
              .bool,
          children:
            delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default.a
              .node.isRequired,
        },
        theme = __webpack_require__(4);
      function _extends() {
        return (_extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key]);
            }
            return target;
          }).apply(this, arguments);
      }
      var primaryButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";position:relative;border:none;&:hover{--color-text:",
            ";--color-bg:",
            ";border-color:var(--color-bg);}",
          ],
          theme.a.white,
          theme.a.primary,
          theme.a.white,
          Object(polished_esmfrom_dll_reference_storybook_docs_dll.darken)(
            0.1,
            theme.a.secondary
          )
        ),
        secondaryButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";border:1px solid var(--color-text);&:hover{--color-text:",
            ";--color-bg:",
            ";border-color:var(--color-bg);}",
          ],
          theme.a.primary,
          theme.a.white,
          theme.a.white,
          theme.a.secondary
        ),
        tertiaryButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:transparent;border:1px solid transparent;&:hover{--color-text:",
            ";--color-bg:",
            ";}",
          ],
          theme.a.primary,
          theme.a.white,
          theme.a.primary
        ),
        tertiaryLightButton = Object(styled_components_browser_esm.a)(
          [
            "",
            ";--color-text:",
            ";&:hover{--color-text:",
            ";--color-bg:",
            ";}",
          ],
          tertiaryButton,
          theme.a.white,
          theme.a.black,
          theme.a.white
        ),
        positiveButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";position:relative;border:none;&:hover{--color-text:",
            ";--color-bg:",
            ";border-color:var(--color-bg);}",
          ],
          theme.a.white,
          theme.a.positive,
          theme.a.white,
          Object(polished_esmfrom_dll_reference_storybook_docs_dll.darken)(
            0.1,
            theme.a.positive
          )
        ),
        negativeButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";position:relative;border:none;&:hover{--color-text:",
            ";--color-bg:",
            ";border-color:var(--color-bg);}",
          ],
          theme.a.white,
          theme.a.negative,
          theme.a.white,
          Object(polished_esmfrom_dll_reference_storybook_docs_dll.darken)(
            0.1,
            theme.a.negative
          )
        ),
        navigationButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";position:relative;border-bottom:1px solid ",
            ";border-radius:0;&:hover{--color-text:",
            ";--color-bg:",
            ";border-color:var(--color-bg);border-bottom:1px solid ",
            ";border-radius:0;}&:focus{background-color:",
            ";box-shadow:0;outline:0;--color-text:",
            ";}",
          ],
          theme.a.grey,
          theme.a.darkerBlack,
          theme.a.darkerBlack,
          theme.a.lighterGrey,
          Object(polished_esmfrom_dll_reference_storybook_docs_dll.darken)(
            0.1,
            theme.a.textLight
          ),
          theme.a.white,
          theme.a.tertiary,
          theme.a.black
        ),
        navigationModalButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";position:relative;border-bottom:1px solid ",
            ";border-radius:0;&:hover{--color-text:",
            ";--color-bg:",
            ";border-color:var(--color-bg);border-bottom:1px solid ",
            ";border-radius:0;}",
          ],
          theme.a.grey,
          theme.a.darkerBlack,
          theme.a.darkerBlack,
          theme.a.lighterGrey,
          Object(polished_esmfrom_dll_reference_storybook_docs_dll.darken)(
            0.1,
            theme.a.textLight
          ),
          theme.a.white
        ),
        navigationOnButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";position:relative;border-bottom:1px solid ",
            ";border-radius:0;",
          ],
          theme.a.black,
          theme.a.tertiary,
          theme.a.darkerBlack
        ),
        signoutButton = Object(styled_components_browser_esm.a)(
          [
            "color:",
            ";--color-text:",
            ";--color-bg:",
            ";position:relative;border-radius:0;&:hover{background-color:",
            ";--color-text:",
            ";--color-bg:",
            ";border-color:var(--color-bg);border-radius:0;}&:focus{background-color:",
            ";box-shadow:0;outline:0;--color-text:",
            ";}",
          ],
          theme.a.darkerBlack,
          theme.a.darkerBlack,
          theme.a.darkerBlack,
          Object(polished_esmfrom_dll_reference_storybook_docs_dll.darken)(
            0.1,
            theme.a.orange
          ),
          Object(polished_esmfrom_dll_reference_storybook_docs_dll.darken)(
            0.1,
            theme.a.darkerBlack
          ),
          Object(polished_esmfrom_dll_reference_storybook_docs_dll.darken)(
            0.1,
            theme.a.orange
          ),
          theme.a.tertiary,
          theme.a.black
        ),
        greyedButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";position:relative;border:none;&:hover{--color-text:",
            ";--color-bg:",
            ";border-color:var(--color-bg);}",
          ],
          theme.a.white,
          theme.a.grey,
          theme.a.white,
          Object(polished_esmfrom_dll_reference_storybook_docs_dll.darken)(
            0.1,
            theme.a.grey
          )
        ),
        navHeaderButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";border:none;border-radius:0;&:hover{--color-text:",
            ";--color-bg:",
            ";border-radius:0;}&:active{background-color:",
            ";box-shadow:0;outline:0;--color-text:",
            ";}",
          ],
          theme.a.white,
          theme.a.darkGrey,
          theme.a.white,
          theme.a.black,
          theme.a.darkGrey,
          theme.a.white
        ),
        navAddMenuButton = Object(styled_components_browser_esm.a)(
          [
            "--color-text:",
            ";--color-bg:",
            ";border:none;border-radius:0;&:hover{--color-bg:",
            ";border-radius:0;}&:focus{background-color:",
            ";box-shadow:0;outline:0;--color-text:",
            ";}&[disabled]{--color-text:",
            ";opacity:1;}",
          ],
          theme.a.darkerBlack,
          theme.a.tertiary,
          theme.a.greyedOrange,
          theme.a.darkGrey,
          theme.a.white,
          theme.a.disabledGreyOnOrange
        ),
        mediumButton = Object(styled_components_browser_esm.a)([
          "padding:0.4em 0.8em;",
        ]),
        smallButton = Object(styled_components_browser_esm.a)(["padding:0;"]),
        Button = styled_components_browser_esm.b.button.withConfig({
          displayName: "Button",
          componentId: "sc-11dla3f-0",
        })(
          [
            "display:inline-flex;flex:0 0 auto;color:var(--color-text);background-color:var(--color-bg);padding:0.75em 2em;border-radius:",
            ";font-size:1em;font-weight:600;cursor:pointer;line-height:1;justify-content:center;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;text-decoration:none;transition:all 100ms ease-out;letter-spacing:0;position:relative;overflow:hidden;border:1px solid var(--color-bg);&:focus,&:active{outline-width:0;}&:focus{outline:none;}&[disabled]{pointer-events:none;opacity:0.6;}",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
            ";",
          ],
          theme.b,
          function(props) {
            return "primary" === props.variant && primaryButton;
          },
          function(props) {
            return "secondary" === props.variant && secondaryButton;
          },
          function(props) {
            return "tertiary" === props.variant && tertiaryButton;
          },
          function(props) {
            return "tertiary-light" === props.variant && tertiaryLightButton;
          },
          function(props) {
            return "positive" === props.variant && positiveButton;
          },
          function(props) {
            return "negative" === props.variant && negativeButton;
          },
          function(props) {
            return "navigation" === props.variant && navigationButton;
          },
          function(props) {
            return (
              "navigation-modal" === props.variant && navigationModalButton
            );
          },
          function(props) {
            return "navigation-on" === props.variant && navigationOnButton;
          },
          function(props) {
            return "signout" === props.variant && signoutButton;
          },
          function(props) {
            return "greyed" === props.variant && greyedButton;
          },
          function(props) {
            return "nav-header" === props.variant && navHeaderButton;
          },
          function(props) {
            return "nav-addMenu" === props.variant && navAddMenuButton;
          },
          function(props) {
            return props.medium && mediumButton;
          },
          function(props) {
            return props.small && smallButton;
          }
        );
      (Button.propTypes = _extends({}, propTypes, {
        type: delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default.a.oneOf(
          ["button", "submit"]
        ),
      })),
        (Button.defaultProps = { type: "button", variant: "primary" });
      __webpack_exports__.a = Button;
    },
    24: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("KqXw");
    },
    243: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("ax0f");
    },
    244: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("m9LP");
    },
    245: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("7nmT");
    },
    249: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("l1C2");
    },
    253: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("sVFb");
    },
    254: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("iKE+");
    },
    259: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("CUMQ");
    },
    26: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("hCOa");
    },
    260: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("mlET");
    },
    27: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("lN5B");
    },
    28: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("aWzz");
    },
    29: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("NyMY");
    },
    291: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("b2e3");
    },
    3: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("IAdD");
    },
    31: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("UvmB");
    },
    32: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("EgRP");
    },
    320: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("F63i");
    },
    33: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("yH/f");
    },
    34: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("+oxZ");
    },
    35: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("aokA");
    },
    352: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("YZNk");
    },
    353: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("pNTX");
    },
    354: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("BS/m");
    },
    355: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("oXkQ");
    },
    357: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("T4+q");
    },
    358: function(module, exports, __webpack_require__) {
      module.exports =
        __webpack_require__.p + "static/media/icon-select.9c9443fc.svg";
    },
    359: function(module, exports, __webpack_require__) {
      module.exports =
        __webpack_require__.p + "static/media/loader.ee476869.svg";
    },
    36: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("jwue");
    },
    360: function(module, exports, __webpack_require__) {
      module.exports =
        __webpack_require__.p +
        "static/media/android-chrome-256x256.6939da33.png";
    },
    365: function(module, exports, __webpack_require__) {
      __webpack_require__(366),
        __webpack_require__(391),
        __webpack_require__(392),
        __webpack_require__(533),
        __webpack_require__(830),
        __webpack_require__(863),
        __webpack_require__(868),
        __webpack_require__(880),
        __webpack_require__(969),
        __webpack_require__(971),
        (module.exports = __webpack_require__(980));
    },
    367: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("ARua");
    },
    37: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("LW0h");
    },
    379: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("gqY9");
    },
    38: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("cxan");
    },
    384: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("9JhN");
    },
    385: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("PjZX");
    },
    39: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("A3UQ");
    },
    392: function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__(221);
    },
    398: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("/Qos");
    },
    399: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("JY+C");
    },
    4: function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.d(__webpack_exports__, "a", function() {
        return colors;
      }),
        __webpack_require__.d(__webpack_exports__, "b", function() {
          return radius;
        });
      var colors = {
        blue: "#3B7A9E",
        paleBlue: "#f0f1f9",
        lightBlue: "#61BDE0",
        darkBlue: "#5F7682",
        darkerBlue: "#003c57",
        grey: "#999999",
        darkGrey: "#666666",
        lightGrey: "#d6d8da",
        lightMediumGrey: "#E4E8EB",
        lighterGrey: "#f5f5f5",
        disabledGreyOnOrange: "#7A6340",
        red: "#D0021B",
        orange: "#FDBD56",
        amber: "#fe781f",
        green: "#0f8243",
        highlightGreen: "#dce5b0",
        black: "#333333",
        darkerBlack: "#222222",
        white: "#FFFFFF",
        greyedOrange: "#D9A551",
      };
      (colors.primary = colors.blue),
        (colors.secondary = colors.blue),
        (colors.tertiary = colors.orange),
        (colors.positive = colors.green),
        (colors.negative = colors.red),
        (colors.text = colors.black),
        (colors.textLight = colors.darkGrey),
        (colors.borders = colors.grey),
        (colors.bordersLight = colors.lightGrey),
        (colors.previewError = colors.grey);
      var radius = "4px";
    },
    40: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("MvUL");
    },
    403: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("ZUdG");
    },
    409: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("tQbP");
    },
    42: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("7xRU");
    },
    44: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("aYSr");
    },
    45: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("Ysgh");
    },
    46: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("KOtZ");
    },
    47: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("1Iuc");
    },
    48: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("P2aG");
    },
    5: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("1t7P");
    },
    50: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("jQ3i");
    },
    504: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("wFLD");
    },
    516: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("dSaG");
    },
    517: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("hQin");
    },
    536: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("LJ7e");
    },
    538: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("I2fK");
    },
    539: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("DY47");
    },
    545: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("3kp9");
    },
    549: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("/bc2");
    },
    55: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("ZVkB");
    },
    550: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("/JuR");
    },
    551: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("+Bxv");
    },
    552: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("muFx");
    },
    553: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("Wci6");
    },
    554: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("WoRU");
    },
    555: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("o3fS");
    },
    556: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("JmTi");
    },
    557: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("xaiR");
    },
    558: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("SlD/");
    },
    559: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("Monn");
    },
    56: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("x4t0");
    },
    561: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("fmNP");
    },
    565: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("uFXj");
    },
    569: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("OCSl");
    },
    6: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("ho0z");
    },
    63: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("WNMA");
    },
    66: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("Yct5");
    },
    67: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("1IsZ");
    },
    68: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("hBpG");
    },
    684: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("kA4r");
    },
    686: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("Blm6");
    },
    687: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("ssvU");
    },
    688: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("lZm3");
    },
    69: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("fRV1");
    },
    692: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("Ee2X");
    },
    70: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("vbDw");
    },
    793: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("5BYb");
    },
    8: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("+KXO");
    },
    803: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("maj8");
    },
    81: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("BFfR");
    },
    87: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("JtPf");
    },
    9: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("jQ/y");
    },
    91: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("tVqn");
    },
    971: function(module, exports, __webpack_require__) {
      "use strict";
      __webpack_require__(37),
        __webpack_require__(972),
        __webpack_require__(34);
      var _clientApi = __webpack_require__(41),
        _clientLogger = __webpack_require__(30),
        _configFilename = __webpack_require__(978);
      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly &&
            (symbols = symbols.filter(function(sym) {
              return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            })),
            keys.push.apply(keys, symbols);
        }
        return keys;
      }
      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = null != arguments[i] ? arguments[i] : {};
          i % 2
            ? ownKeys(Object(source), !0).forEach(function(key) {
                _defineProperty(target, key, source[key]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(
                target,
                Object.getOwnPropertyDescriptors(source)
              )
            : ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(
                  target,
                  key,
                  Object.getOwnPropertyDescriptor(source, key)
                );
              });
        }
        return target;
      }
      function _defineProperty(obj, key, value) {
        return (
          key in obj
            ? Object.defineProperty(obj, key, {
                value: value,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (obj[key] = value),
          obj
        );
      }
      (_configFilename.args || _configFilename.argTypes) &&
        _clientLogger.logger.warn(
          "Invalid args/argTypes in config, ignoring.",
          JSON.stringify({
            args: _configFilename.args,
            argTypes: _configFilename.argTypes,
          })
        ),
        _configFilename.decorators &&
          _configFilename.decorators.forEach(function(decorator) {
            return (0, _clientApi.addDecorator)(decorator, !1);
          }),
        (_configFilename.parameters ||
          _configFilename.globals ||
          _configFilename.globalTypes) &&
          (0, _clientApi.addParameters)(
            _objectSpread(
              _objectSpread({}, _configFilename.parameters),
              {},
              {
                globals: _configFilename.globals,
                globalTypes: _configFilename.globalTypes,
              }
            ),
            !1
          ),
        _configFilename.argTypesEnhancers &&
          _configFilename.argTypesEnhancers.forEach(function(enhancer) {
            return (0, _clientApi.addArgTypesEnhancer)(enhancer);
          });
    },
    973: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("1Mu/");
    },
    974: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("oD4t");
    },
    975: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("N4z3");
    },
    976: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("GFpt");
    },
    977: function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(2)("2sZ7");
    },
    978: function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, "parameters", function() {
          return parameters;
        }),
        __webpack_require__.d(__webpack_exports__, "decorators", function() {
          return decorators;
        });
      var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1),
        react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__
        ),
        react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          363
        ),
        history__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(53),
        parameters = { actions: { argTypesRegex: "^on[A-Z].*" } },
        decorators = [
          function(Story) {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              react_router_dom__WEBPACK_IMPORTED_MODULE_1__.b,
              {
                history: Object(history__WEBPACK_IMPORTED_MODULE_2__.b)({
                  initialEntries: ["/"],
                }),
              },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                react_router_dom__WEBPACK_IMPORTED_MODULE_1__.a,
                { path: "/" },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  Story,
                  null
                )
              )
            );
          },
        ];
    },
    980: function(module, exports, __webpack_require__) {
      "use strict";
      (function(module) {
        (0, __webpack_require__(221).configure)(
          [__webpack_require__(981), __webpack_require__(984)],
          module,
          !1
        );
      }.call(this, __webpack_require__(44)(module)));
    },
    981: function(module, exports, __webpack_require__) {
      var map = {
        "./storybook/Components/Button.stories.mdx": 982,
        "./storybook/Components/Select.stories.mdx": 986,
        "./storybook/Introduction.stories.mdx": 983,
      };
      function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
      }
      function webpackContextResolve(req) {
        if (!__webpack_require__.o(map, req)) {
          var e = new Error("Cannot find module '" + req + "'");
          throw ((e.code = "MODULE_NOT_FOUND"), e);
        }
        return map[req];
      }
      (webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map);
      }),
        (webpackContext.resolve = webpackContextResolve),
        (module.exports = webpackContext),
        (webpackContext.id = 981);
    },
    982: function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, "primary", function() {
          return primary;
        }),
        __webpack_require__.d(__webpack_exports__, "secondary", function() {
          return secondary;
        }),
        __webpack_require__.d(__webpack_exports__, "tertiary", function() {
          return tertiary;
        }),
        __webpack_require__.d(__webpack_exports__, "tertiaryLight", function() {
          return tertiaryLight;
        }),
        __webpack_require__.d(__webpack_exports__, "positive", function() {
          return positive;
        }),
        __webpack_require__.d(__webpack_exports__, "negative", function() {
          return negative;
        }),
        __webpack_require__.d(__webpack_exports__, "navigation", function() {
          return navigation;
        }),
        __webpack_require__.d(
          __webpack_exports__,
          "navigationModal",
          function() {
            return navigationModal;
          }
        ),
        __webpack_require__.d(__webpack_exports__, "navigationOn", function() {
          return navigationOn;
        }),
        __webpack_require__.d(__webpack_exports__, "signOut", function() {
          return signOut;
        }),
        __webpack_require__.d(__webpack_exports__, "greyed", function() {
          return greyed;
        }),
        __webpack_require__.d(__webpack_exports__, "medium", function() {
          return medium;
        }),
        __webpack_require__.d(__webpack_exports__, "small", function() {
          return small;
        }),
        __webpack_require__.d(__webpack_exports__, "disabled", function() {
          return disabled;
        });
      __webpack_require__(10), __webpack_require__(3), __webpack_require__(1);
      var _mdx_js_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0),
        _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          13
        ),
        _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          23
        );
      function _extends() {
        return (_extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key]);
            }
            return target;
          }).apply(this, arguments);
      }
      function _objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var key,
          i,
          target = (function _objectWithoutPropertiesLoose(source, excluded) {
            if (null == source) return {};
            var key,
              i,
              target = {},
              sourceKeys = Object.keys(source);
            for (i = 0; i < sourceKeys.length; i++)
              (key = sourceKeys[i]),
                excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
          })(source, excluded);
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
              excluded.indexOf(key) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(source, key) &&
                  (target[key] = source[key]));
        }
        return target;
      }
      var layoutProps = {};
      function MDXContent(_ref) {
        var components = _ref.components,
          props = _objectWithoutProperties(_ref, ["components"]);
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          "wrapper",
          _extends({}, layoutProps, props, {
            components: components,
            mdxType: "MDXLayout",
          }),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Meta,
            {
              title: "Components/Button",
              component:
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
              mdxType: "Meta",
            }
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h1",
            { id: "button" },
            "Button"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "p",
            null,
            "TODO"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h2",
            { id: "example" },
            "Example"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Primary", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { mdxType: "Button" },
                "Primary"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h2",
            { id: "when-to-use-this-component" },
            "When to use this component"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "p",
            null,
            "TODO"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h2",
            { id: "when-not-to-use-this-component" },
            "When not to use this component"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "p",
            null,
            "TODO"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h2",
            { id: "how-to-use-this-component" },
            "How to use this component"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "p",
            null,
            "TODO"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h2",
            { id: "variants" },
            "Variants"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "secondary" },
            "Secondary"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Secondary", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "secondary", mdxType: "Button" },
                "Secondary"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "tertiary" },
            "Tertiary"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Tertiary", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "tertiary", mdxType: "Button" },
                "Tertiary"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "tertiary-light" },
            "Tertiary light"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Tertiary light", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "tertiary-light", mdxType: "Button" },
                "Tertiary light"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "positive" },
            "Positive"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Positive", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "positive", mdxType: "Button" },
                "Positive"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "negative" },
            "Negative"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Negative", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "negative", mdxType: "Button" },
                "Negative"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "navigation" },
            "Navigation"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Navigation", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "navigation", mdxType: "Button" },
                "Navigation"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "navigation-modal" },
            "Navigation modal"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Navigation modal", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "navigation-modal", mdxType: "Button" },
                "Navigation modal"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "navigation-on" },
            "Navigation on"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Navigation on", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "navigation-on", mdxType: "Button" },
                "Navigation-on"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "sign-out" },
            "Sign out"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Sign out", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "signout", mdxType: "Button" },
                "Sign out"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "greyed" },
            "Greyed"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Greyed", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { variant: "greyed", mdxType: "Button" },
                "Tertiary"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "medium" },
            "Medium"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Medium", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { medium: !0, mdxType: "Button" },
                "Medium"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "small" },
            "Small"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Small", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { small: !0, mdxType: "Button" },
                "Small"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "disabled" },
            "Disabled"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Canvas,
            { mdxType: "Canvas" },
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.Story,
              { name: "Disabled", mdxType: "Story" },
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
                { disabled: !0, mdxType: "Button" },
                "Disabled"
              )
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h2",
            { id: "accessibility" },
            "Accessibility"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "p",
            null,
            "TODO"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h2",
            { id: "research" },
            "Research"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "p",
            null,
            "TODO"
          )
        );
      }
      (MDXContent.displayName = "MDXContent"), (MDXContent.isMDXComponent = !0);
      var primary = function primary() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          null,
          "Primary"
        );
      };
      (primary.displayName = "primary"),
        (primary.storyName = "Primary"),
        (primary.parameters = {
          storySource: { source: "<Button>Primary</Button>" },
        });
      var secondary = function secondary() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "secondary" },
          "Secondary"
        );
      };
      (secondary.displayName = "secondary"),
        (secondary.storyName = "Secondary"),
        (secondary.parameters = {
          storySource: {
            source: '<Button variant="secondary">Secondary</Button>',
          },
        });
      var tertiary = function tertiary() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "tertiary" },
          "Tertiary"
        );
      };
      (tertiary.displayName = "tertiary"),
        (tertiary.storyName = "Tertiary"),
        (tertiary.parameters = {
          storySource: {
            source: '<Button variant="tertiary">Tertiary</Button>',
          },
        });
      var tertiaryLight = function tertiaryLight() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "tertiary-light" },
          "Tertiary light"
        );
      };
      (tertiaryLight.displayName = "tertiaryLight"),
        (tertiaryLight.storyName = "Tertiary light"),
        (tertiaryLight.parameters = {
          storySource: {
            source: '<Button variant="tertiary-light">Tertiary light</Button>',
          },
        });
      var positive = function positive() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "positive" },
          "Positive"
        );
      };
      (positive.displayName = "positive"),
        (positive.storyName = "Positive"),
        (positive.parameters = {
          storySource: {
            source: '<Button variant="positive">Positive</Button>',
          },
        });
      var negative = function negative() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "negative" },
          "Negative"
        );
      };
      (negative.displayName = "negative"),
        (negative.storyName = "Negative"),
        (negative.parameters = {
          storySource: {
            source: '<Button variant="negative">Negative</Button>',
          },
        });
      var navigation = function navigation() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "navigation" },
          "Navigation"
        );
      };
      (navigation.displayName = "navigation"),
        (navigation.storyName = "Navigation"),
        (navigation.parameters = {
          storySource: {
            source: '<Button variant="navigation">Navigation</Button>',
          },
        });
      var navigationModal = function navigationModal() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "navigation-modal" },
          "Navigation modal"
        );
      };
      (navigationModal.displayName = "navigationModal"),
        (navigationModal.storyName = "Navigation modal"),
        (navigationModal.parameters = {
          storySource: {
            source:
              '<Button variant="navigation-modal">Navigation modal</Button>',
          },
        });
      var navigationOn = function navigationOn() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "navigation-on" },
          "Navigation-on"
        );
      };
      (navigationOn.displayName = "navigationOn"),
        (navigationOn.storyName = "Navigation on"),
        (navigationOn.parameters = {
          storySource: {
            source: '<Button variant="navigation-on">Navigation-on</Button>',
          },
        });
      var signOut = function signOut() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "signout" },
          "Sign out"
        );
      };
      (signOut.displayName = "signOut"),
        (signOut.storyName = "Sign out"),
        (signOut.parameters = {
          storySource: {
            source: '<Button variant="signout">Sign out</Button>',
          },
        });
      var greyed = function greyed() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { variant: "greyed" },
          "Tertiary"
        );
      };
      (greyed.displayName = "greyed"),
        (greyed.storyName = "Greyed"),
        (greyed.parameters = {
          storySource: { source: '<Button variant="greyed">Tertiary</Button>' },
        });
      var medium = function medium() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { medium: !0 },
          "Medium"
        );
      };
      (medium.displayName = "medium"),
        (medium.storyName = "Medium"),
        (medium.parameters = {
          storySource: { source: "<Button medium>Medium</Button>" },
        });
      var small = function small() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { small: !0 },
          "Small"
        );
      };
      (small.displayName = "small"),
        (small.storyName = "Small"),
        (small.parameters = {
          storySource: { source: "<Button small>Small</Button>" },
        });
      var disabled = function disabled() {
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          { disabled: !0 },
          "Disabled"
        );
      };
      (disabled.displayName = "disabled"),
        (disabled.storyName = "Disabled"),
        (disabled.parameters = {
          storySource: { source: "<Button disabled>Disabled</Button>" },
        });
      var componentMeta = {
          title: "Components/Button",
          component: _components_buttons_Button__WEBPACK_IMPORTED_MODULE_5__.a,
          includeStories: [
            "primary",
            "secondary",
            "tertiary",
            "tertiaryLight",
            "positive",
            "negative",
            "navigation",
            "navigationModal",
            "navigationOn",
            "signOut",
            "greyed",
            "medium",
            "small",
            "disabled",
          ],
        },
        mdxStoryNameToKey = {
          Primary: "primary",
          Secondary: "secondary",
          Tertiary: "tertiary",
          "Tertiary light": "tertiaryLight",
          Positive: "positive",
          Negative: "negative",
          Navigation: "navigation",
          "Navigation modal": "navigationModal",
          "Navigation on": "navigationOn",
          "Sign out": "signOut",
          Greyed: "greyed",
          Medium: "medium",
          Small: "small",
          Disabled: "disabled",
        };
      (componentMeta.parameters = componentMeta.parameters || {}),
        (componentMeta.parameters.docs = Object.assign(
          {},
          componentMeta.parameters.docs || {},
          {
            page: function page() {
              return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.AddContext,
                {
                  mdxStoryNameToKey: mdxStoryNameToKey,
                  mdxComponentMeta: componentMeta,
                },
                Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                  MDXContent,
                  null
                )
              );
            },
          }
        )),
        (__webpack_exports__.default = componentMeta);
    },
    983: function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, "__page", function() {
          return __page;
        });
      __webpack_require__(10), __webpack_require__(3), __webpack_require__(1);
      var _mdx_js_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0),
        _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
          13
        ),
        _public_android_chrome_256x256_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
          360
        ),
        _public_android_chrome_256x256_png__WEBPACK_IMPORTED_MODULE_5___default = __webpack_require__.n(
          _public_android_chrome_256x256_png__WEBPACK_IMPORTED_MODULE_5__
        );
      function _extends() {
        return (_extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key]);
            }
            return target;
          }).apply(this, arguments);
      }
      function _objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var key,
          i,
          target = (function _objectWithoutPropertiesLoose(source, excluded) {
            if (null == source) return {};
            var key,
              i,
              target = {},
              sourceKeys = Object.keys(source);
            for (i = 0; i < sourceKeys.length; i++)
              (key = sourceKeys[i]),
                excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
          })(source, excluded);
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
              excluded.indexOf(key) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(source, key) &&
                  (target[key] = source[key]));
        }
        return target;
      }
      var Meta = (function makeShortcode(name) {
          return function MDXDefaultShortcode(props) {
            return (
              console.warn(
                "Component " +
                  name +
                  " was not imported, exported, or provided by MDXProvider as global scope"
              ),
              Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                "div",
                props
              )
            );
          };
        })("Meta"),
        layoutProps = {};
      function MDXContent(_ref) {
        var components = _ref.components,
          props = _objectWithoutProperties(_ref, ["components"]);
        return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
          "wrapper",
          _extends({}, layoutProps, props, {
            components: components,
            mdxType: "MDXLayout",
          }),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(Meta, {
            title: "Introduction",
            mdxType: "Meta",
          }),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "style",
            null,
            "\n  img.centered {\n    display: block;\n    margin-left: auto;\n    margin-right: auto;\n    margin-bottom: 2em;\n  }\n"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)("img", {
            src:
              _public_android_chrome_256x256_png__WEBPACK_IMPORTED_MODULE_5___default.a,
            alt: "Author logo",
            class: "centered",
          }),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "p",
            null,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dignissim cras tincidunt lobortis feugiat vivamus at augue eget. Risus viverra adipiscing at in tellus integer feugiat. Dolor sit amet consectetur adipiscing elit ut aliquam purus sit. Aliquet enim tortor at auctor urna nunc. Ultrices sagittis orci a scelerisque purus semper eget duis. Mauris commodo quis imperdiet massa tincidunt. Venenatis a condimentum vitae sapien pellentesque habitant morbi tristique. Aliquam sem et tortor consequat id porta nibh venenatis. Tristique senectus et netus et malesuada fames ac. Nec tincidunt praesent semper feugiat nibh. Sed euismod nisi porta lorem mollis aliquam ut porttitor."
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "blockquote",
            null,
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              "p",
              { parentName: "blockquote" },
              "We can have a blockquote, if we want one."
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h1",
            { id: "ooh-heading-1" },
            "Ooh... (Heading 1)"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h2",
            { id: "we-heading-2" },
            "We (Heading 2)"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h3",
            { id: "can-heading-3" },
            "can (Heading 3)"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h4",
            { id: "also-heading-4" },
            "also (Heading 4)"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h5",
            { id: "have-heading-5" },
            "have (Heading 5)"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "h6",
            { id: "subheadings-heading-6" },
            "subheadings (Heading 6)"
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "ul",
            null,
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              "li",
              { parentName: "ul" },
              "Here is"
            ),
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              "li",
              { parentName: "ul" },
              "a bullet"
            ),
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              "li",
              { parentName: "ul" },
              "list"
            )
          ),
          Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
            "ol",
            null,
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              "li",
              { parentName: "ol" },
              "Here is"
            ),
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              "li",
              { parentName: "ol" },
              "A numbered"
            ),
            Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
              "li",
              { parentName: "ol" },
              "List"
            )
          )
        );
      }
      (MDXContent.displayName = "MDXContent"), (MDXContent.isMDXComponent = !0);
      var __page = function __page() {
        throw new Error("Docs-only story");
      };
      __page.parameters = { docsOnly: !0 };
      var componentMeta = { title: "Introduction", includeStories: ["__page"] },
        mdxStoryNameToKey = {};
      (componentMeta.parameters = componentMeta.parameters || {}),
        (componentMeta.parameters.docs = Object.assign(
          {},
          componentMeta.parameters.docs || {},
          {
            page: function page() {
              return Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                _storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_4__.AddContext,
                {
                  mdxStoryNameToKey: mdxStoryNameToKey,
                  mdxComponentMeta: componentMeta,
                },
                Object(_mdx_js_react__WEBPACK_IMPORTED_MODULE_3__.mdx)(
                  MDXContent,
                  null
                )
              );
            },
          }
        )),
        (__webpack_exports__.default = componentMeta);
    },
    984: function(module, exports, __webpack_require__) {
      var map = {
        "./storybook/Patterns/ButtonGroup.stories.js": 988,
        "./storybook/Patterns/ScrollPane.stories.js": 987,
      };
      function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
      }
      function webpackContextResolve(req) {
        if (!__webpack_require__.o(map, req)) {
          var e = new Error("Cannot find module '" + req + "'");
          throw ((e.code = "MODULE_NOT_FOUND"), e);
        }
        return map[req];
      }
      (webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map);
      }),
        (webpackContext.resolve = webpackContextResolve),
        (module.exports = webpackContext),
        (webpackContext.id = 984);
    },
    986: function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, "primary", function() {
          return Select_stories_primary;
        }),
        __webpack_require__.d(__webpack_exports__, "loading", function() {
          return Select_stories_loading;
        });
      __webpack_require__(10), __webpack_require__(3);
      var delegated_reactfrom_dll_reference_storybook_docs_dll = __webpack_require__(
          1
        ),
        delegated_reactfrom_dll_reference_storybook_docs_dll_default = __webpack_require__.n(
          delegated_reactfrom_dll_reference_storybook_docs_dll
        ),
        esm = __webpack_require__(0),
        blocks = __webpack_require__(13),
        styled_components_browser_esm = __webpack_require__(25),
        icon_select = __webpack_require__(358),
        icon_select_default = __webpack_require__.n(icon_select),
        loader = __webpack_require__(359),
        loader_default = __webpack_require__.n(loader),
        theme = __webpack_require__(4),
        focusStyle = Object(styled_components_browser_esm.a)(
          ["border-color:", ";outline-color:", ";box-shadow:0 0 0 3px ", ";"],
          theme.a.blue,
          theme.a.blue,
          theme.a.tertiary
        ),
        invalidStyle = Object(styled_components_browser_esm.a)(
          [
            "border-color:",
            ";&:focus,&:focus-within{border-color:",
            ";outline-color:",
            ";box-shadow:0 0 0 2px ",
            ";}&:hover{border-color:",
            ";outline-color:",
            ";}",
          ],
          theme.a.red,
          theme.a.red,
          theme.a.red,
          theme.a.red,
          theme.a.red,
          theme.a.red
        ),
        sharedStyles = Object(styled_components_browser_esm.a)(
          [
            "font-size:1em;border:thin solid ",
            ";padding:0.5em;color:",
            ";display:block;width:100%;transition:outline-color 100ms ease-in,border-color 100ms ease-in;outline:thin solid transparent;&:hover{border-color:",
            ";outline-color:",
            ";}&:focus,&:focus-within{",
            ";}&::placeholder{color:#a3a3a3;}&:focus{outline:none;border:1px solid ",
            ";}&[disabled]{opacity:0.8;pointer-events:none;}",
            ";",
          ],
          theme.a.borders,
          theme.a.black,
          theme.a.blue,
          theme.a.blue,
          focusStyle,
          theme.a.primary,
          function(props) {
            return props.invalid && invalidStyle;
          }
        ),
        delegated_prop_typesfrom_dll_reference_storybook_docs_dll =
          (__webpack_require__(20),
          __webpack_require__(15),
          __webpack_require__(28)),
        delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default = __webpack_require__.n(
          delegated_prop_typesfrom_dll_reference_storybook_docs_dll
        );
      function _extends() {
        return (_extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key]);
            }
            return target;
          }).apply(this, arguments);
      }
      function _objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var key,
          i,
          target = (function _objectWithoutPropertiesLoose(source, excluded) {
            if (null == source) return {};
            var key,
              i,
              target = {},
              sourceKeys = Object.keys(source);
            for (i = 0; i < sourceKeys.length; i++)
              (key = sourceKeys[i]),
                excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
          })(source, excluded);
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
              excluded.indexOf(key) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(source, key) &&
                  (target[key] = source[key]));
        }
        return target;
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor))
          throw new TypeError("Cannot call a class as a function");
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          (descriptor.enumerable = descriptor.enumerable || !1),
            (descriptor.configurable = !0),
            "value" in descriptor && (descriptor.writable = !0),
            Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _setPrototypeOf(o, p) {
        return (_setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(o, p) {
            return (o.__proto__ = p), o;
          })(o, p);
      }
      function _createSuper(Derived) {
        var hasNativeReflectConstruct = (function _isNativeReflectConstruct() {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return (
              Date.prototype.toString.call(
                Reflect.construct(Date, [], function() {})
              ),
              !0
            );
          } catch (e) {
            return !1;
          }
        })();
        return function _createSuperInternal() {
          var result,
            Super = _getPrototypeOf(Derived);
          if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
          } else result = Super.apply(this, arguments);
          return _possibleConstructorReturn(this, result);
        };
      }
      function _possibleConstructorReturn(self, call) {
        return !call || ("object" != typeof call && "function" != typeof call)
          ? (function _assertThisInitialized(self) {
              if (void 0 === self)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return self;
            })(self)
          : call;
      }
      function _getPrototypeOf(o) {
        return (_getPrototypeOf = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function _getPrototypeOf(o) {
              return o.__proto__ || Object.getPrototypeOf(o);
            })(o);
      }
      var Forms_withChangeHandler = function withChangeHandler(
          WrappedComponent
        ) {
          var _class, _temp;
          return (
            (_temp = _class = (function(_React$Component) {
              !(function _inherits(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass)
                  throw new TypeError(
                    "Super expression must either be null or a function"
                  );
                (subClass.prototype = Object.create(
                  superClass && superClass.prototype,
                  {
                    constructor: {
                      value: subClass,
                      writable: !0,
                      configurable: !0,
                    },
                  }
                )),
                  superClass && _setPrototypeOf(subClass, superClass);
              })(_class, _React$Component);
              var _super = _createSuper(_class);
              function _class() {
                var _this;
                _classCallCheck(this, _class);
                for (
                  var _len = arguments.length, args = new Array(_len), _key = 0;
                  _key < _len;
                  _key++
                )
                  args[_key] = arguments[_key];
                return (
                  ((_this = _super.call.apply(
                    _super,
                    [this].concat(args)
                  )).handleChange = function(e) {
                    var name = _this.props.name || _this.props.id,
                      value =
                        "checkbox" === e.target.type
                          ? e.target.checked
                          : e.target.value;
                    _this.props.onChange({ name: name, value: value });
                  }),
                  _this
                );
              }
              return (
                (function _createClass(Constructor, protoProps, staticProps) {
                  return (
                    protoProps &&
                      _defineProperties(Constructor.prototype, protoProps),
                    staticProps && _defineProperties(Constructor, staticProps),
                    Constructor
                  );
                })(_class, [
                  {
                    key: "render",
                    value: function render() {
                      var _this$props = this.props,
                        value = _this$props.value,
                        className = _this$props.className,
                        otherProps = _objectWithoutProperties(_this$props, [
                          "value",
                          "className",
                        ]);
                      return delegated_reactfrom_dll_reference_storybook_docs_dll_default.a.createElement(
                        WrappedComponent,
                        _extends({}, otherProps, {
                          value: null === value ? "" : value,
                          onChange: this.handleChange,
                          className: className,
                        })
                      );
                    },
                  },
                ]),
                _class
              );
            })(
              delegated_reactfrom_dll_reference_storybook_docs_dll_default.a
                .Component
            )),
            (_class.propTypes = {
              onChange:
                delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default
                  .a.func,
              value: delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default.a.oneOfType(
                [
                  delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default
                    .a.string,
                  delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default
                    .a.number,
                ]
              ),
              id:
                delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default
                  .a.string,
              name:
                delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default
                  .a.string,
              className:
                delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default
                  .a.string,
            }),
            (_class.displayName = "withChangeHandler(".concat(
              WrappedComponent.displayName,
              ")"
            )),
            _temp
          );
        },
        Select_loading = Object(styled_components_browser_esm.a)(
          [
            "background:white url('",
            "') no-repeat right 0.4em center;background-size:20px;pointer-events:none;opacity:0.8;",
          ],
          loader_default.a
        ),
        Select = Forms_withChangeHandler(
          styled_components_browser_esm.b.select.withConfig({
            displayName: "Select__SimpleSelect",
            componentId: "v0r85r-0",
          })(
            [
              "",
              ";display:inline-block;padding:0.5em 2em 0.5em 0.75em;background:white url('",
              "') no-repeat right center;appearance:none;position:relative;transition:opacity 100ms ease-in-out;border-radius:4px;line-height:1.2;&:hover{outline:none;}&[disabled]{opacity:0.5;pointer-events:none;}",
              "",
            ],
            sharedStyles,
            icon_select_default.a,
            function(props) {
              return props.loading && Select_loading;
            }
          )
        );
      function Select_stories_extends() {
        return (Select_stories_extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key]);
            }
            return target;
          }).apply(this, arguments);
      }
      function Select_stories_objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var key,
          i,
          target = (function Select_stories_objectWithoutPropertiesLoose(
            source,
            excluded
          ) {
            if (null == source) return {};
            var key,
              i,
              target = {},
              sourceKeys = Object.keys(source);
            for (i = 0; i < sourceKeys.length; i++)
              (key = sourceKeys[i]),
                excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
          })(source, excluded);
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
              excluded.indexOf(key) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(source, key) &&
                  (target[key] = source[key]));
        }
        return target;
      }
      var layoutProps = {};
      function MDXContent(_ref) {
        var components = _ref.components,
          props = Select_stories_objectWithoutProperties(_ref, ["components"]);
        return Object(esm.mdx)(
          "wrapper",
          Select_stories_extends({}, layoutProps, props, {
            components: components,
            mdxType: "MDXLayout",
          }),
          Object(esm.mdx)(blocks.Meta, {
            title: "Components/Select",
            component: Select,
            mdxType: "Meta",
          }),
          Object(esm.mdx)("h1", { id: "select" }, "Select"),
          Object(esm.mdx)(
            "p",
            null,
            "Let users select one option from a dropdown list."
          ),
          Object(esm.mdx)("h2", { id: "example" }, "Example"),
          Object(esm.mdx)(
            blocks.Canvas,
            { mdxType: "Canvas" },
            Object(esm.mdx)(
              blocks.Story,
              { name: "Primary", mdxType: "Story" },
              Object(esm.mdx)(
                Select,
                { mdxType: "Select" },
                Object(esm.mdx)("option", { selected: !0, hidden: !0 }),
                Object(esm.mdx)("option", null, "Alpha"),
                Object(esm.mdx)("option", null, "Bravo"),
                Object(esm.mdx)("option", { disabled: !0 }, "Charlie"),
                Object(esm.mdx)("option", null, "Delta")
              )
            )
          ),
          Object(esm.mdx)(
            "h2",
            { id: "when-to-use-this-component" },
            "When to use this component"
          ),
          Object(esm.mdx)(
            "p",
            null,
            "Only use dropdowns as a last resort. Before using one, try asking users questions which will allow you to present them with fewer options."
          ),
          Object(esm.mdx)("p", null, "Consider using:"),
          Object(esm.mdx)(
            "ul",
            null,
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              "text boxes (if it's easier to type than to select)"
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              "radio buttons (for 5 or fewer options)"
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              "toggles (if there are only 2 options)"
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              "sliders (to let users select a value or range from a fixed set of options)"
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              "steppers for numerical values, potentially combined with text entry (avoid this for values with large variability)"
            )
          ),
          Object(esm.mdx)(
            "h2",
            { id: "when-not-to-use-this-component" },
            "When not to use this component"
          ),
          Object(esm.mdx)(
            "p",
            null,
            "The ",
            Object(esm.mdx)(
              "a",
              Select_stories_extends(
                { parentName: "p" },
                {
                  href:
                    "https://ons-design-system.netlify.app/components/select/",
                  target: "_blank",
                  rel: "nofollow noopener noreferrer",
                }
              ),
              "ONS design system"
            ),
            " and ",
            Object(esm.mdx)(
              "a",
              Select_stories_extends(
                { parentName: "p" },
                {
                  href:
                    "https://design-system.service.gov.uk/components/select/",
                  target: "_blank",
                  rel: "nofollow noopener noreferrer",
                }
              ),
              "GDS design system"
            ),
            " advise against using dropdowns as they:"
          ),
          Object(esm.mdx)(
            "ul",
            null,
            Object(esm.mdx)("li", { parentName: "ul" }, "hide information"),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              "often make the user take multiple actions"
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              "don’t work well on mobile"
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              "can be difficult to use"
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              "can be confusing to users."
            )
          ),
          Object(esm.mdx)(
            "h2",
            { id: "how-to-use-this-component" },
            "How to use this component"
          ),
          Object(esm.mdx)(
            "p",
            null,
            Object(esm.mdx)("strong", { parentName: "p" }, "Labels:"),
            " Use visible labels, built using the HTML ",
            Object(esm.mdx)("inlineCode", { parentName: "p" }, "label"),
            " element, so browsers can calculate an accessible name for the form control from the label content."
          ),
          Object(esm.mdx)(
            "p",
            null,
            Object(esm.mdx)("strong", { parentName: "p" }, "Default options:"),
            ' Avoid having a default option unless most people (around 90%) will select that value. Instead, have a clear and meaningful phrase (e.g. "Select an answer", not generic ones like “None” or “Please select”) inside the menu that tells users exactly what they’re selecting. The label should be in sentence case (the first word capitalised, the rest lowercase).'
          ),
          Object(esm.mdx)(
            "p",
            null,
            Object(esm.mdx)("strong", { parentName: "p" }, "Option order:"),
            " Put the options in a logical order given the context. This might be alphabetical (e.g. a list of countries: Albania, Brazil, Canada), ordinal (e.g. scales: Very small, Small, Medium, Large, Very large), or something else."
          ),
          Object(esm.mdx)(
            "p",
            null,
            Object(esm.mdx)("strong", { parentName: "p" }, "Grouping options:"),
            " Consider grouping options if there are a lot, and a dropdown is the only option. Remember that groups might be ignored by screen readers so don’t rely on this to convey vital context."
          ),
          Object(esm.mdx)(
            "p",
            null,
            Object(esm.mdx)(
              "strong",
              { parentName: "p" },
              "Unavailable options:"
            ),
            " Grey out any unavailable options instead of removing them: any items that cannot b­­e selected should remain in view. Show a short balloon help message if users hover over a greyed-out option for more than a second, explaining why that option is disabled and how to make it active. If disabled items are removed, the interface loses spatial consistency and becomes harder to learn."
          ),
          Object(esm.mdx)("h2", { id: "variants" }, "Variants"),
          Object(esm.mdx)("h3", { id: "loading" }, "Loading"),
          Object(esm.mdx)(
            blocks.Canvas,
            { mdxType: "Canvas" },
            Object(esm.mdx)(
              blocks.Story,
              { name: "Loading", mdxType: "Story" },
              Object(esm.mdx)(
                Select,
                { loading: !0, mdxType: "Select" },
                Object(esm.mdx)("option", { selected: !0, hidden: !0 }),
                Object(esm.mdx)("option", null, "Alpha"),
                Object(esm.mdx)("option", null, "Bravo"),
                Object(esm.mdx)("option", { disabled: !0 }, "Charlie"),
                Object(esm.mdx)("option", null, "Delta")
              )
            )
          ),
          Object(esm.mdx)("h2", { id: "accessibility" }, "Accessibility"),
          Object(esm.mdx)(
            "p",
            null,
            "Dropdowns aren’t very ",
            Object(esm.mdx)("em", { parentName: "p" }, "accessible"),
            ". If you have to use them, make sure you support keyboard input to navigate within them."
          ),
          Object(esm.mdx)("h2", { id: "research" }, "Research"),
          Object(esm.mdx)(
            "ul",
            null,
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              Object(esm.mdx)(
                "a",
                Select_stories_extends(
                  { parentName: "li" },
                  {
                    href: "https://www.nngroup.com/articles/drop-down-menus/",
                    target: "_blank",
                    rel: "nofollow noopener noreferrer",
                  }
                ),
                "Dropdowns: Design Guidelines"
              )
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              Object(esm.mdx)(
                "a",
                Select_stories_extends(
                  { parentName: "li" },
                  {
                    href: "https://baymard.com/blog/drop-down-usability",
                    target: "_blank",
                    rel: "nofollow noopener noreferrer",
                  }
                ),
                "Drop-Down Usability: When You Should (and Shouldn’t) Use Them"
              )
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              Object(esm.mdx)(
                "a",
                Select_stories_extends(
                  { parentName: "li" },
                  {
                    href: "https://webaim.org/techniques/forms/controls#select",
                    target: "_blank",
                    rel: "nofollow noopener noreferrer",
                  }
                ),
                "Select Menus"
              )
            ),
            Object(esm.mdx)(
              "li",
              { parentName: "ul" },
              Object(esm.mdx)(
                "a",
                Select_stories_extends(
                  { parentName: "li" },
                  {
                    href: "https://www.youtube.com/watch?v=CUkMCQR4TpY",
                    target: "_blank",
                    rel: "nofollow noopener noreferrer",
                  }
                ),
                "Alice Bartlett: Burn your select tags - EpicFEL 2014 (VIDEO)"
              )
            )
          )
        );
      }
      (MDXContent.displayName = "MDXContent"), (MDXContent.isMDXComponent = !0);
      var Select_stories_primary = function primary() {
        return Object(esm.mdx)(
          Select,
          null,
          Object(esm.mdx)("option", { selected: !0, hidden: !0 }),
          Object(esm.mdx)("option", null, "Alpha"),
          Object(esm.mdx)("option", null, "Bravo"),
          Object(esm.mdx)("option", { disabled: !0 }, "Charlie"),
          Object(esm.mdx)("option", null, "Delta")
        );
      };
      (Select_stories_primary.displayName = "primary"),
        (Select_stories_primary.storyName = "Primary"),
        (Select_stories_primary.parameters = {
          storySource: {
            source:
              "<Select>\n      <option selected hidden></option>\n      <option>Alpha</option>\n      <option>Bravo</option>\n      <option disabled>Charlie</option>\n      <option>Delta</option>\n    </Select>",
          },
        });
      var Select_stories_loading = function loading() {
        return Object(esm.mdx)(
          Select,
          { loading: !0 },
          Object(esm.mdx)("option", { selected: !0, hidden: !0 }),
          Object(esm.mdx)("option", null, "Alpha"),
          Object(esm.mdx)("option", null, "Bravo"),
          Object(esm.mdx)("option", { disabled: !0 }, "Charlie"),
          Object(esm.mdx)("option", null, "Delta")
        );
      };
      (Select_stories_loading.displayName = "loading"),
        (Select_stories_loading.storyName = "Loading"),
        (Select_stories_loading.parameters = {
          storySource: {
            source:
              "<Select loading>\n      <option selected hidden></option>\n      <option>Alpha</option>\n      <option>Bravo</option>\n      <option disabled>Charlie</option>\n      <option>Delta</option>\n    </Select>",
          },
        });
      var componentMeta = {
          title: "Components/Select",
          component: Select,
          includeStories: ["primary", "loading"],
        },
        mdxStoryNameToKey = { Primary: "primary", Loading: "loading" };
      (componentMeta.parameters = componentMeta.parameters || {}),
        (componentMeta.parameters.docs = Object.assign(
          {},
          componentMeta.parameters.docs || {},
          {
            page: function page() {
              return Object(esm.mdx)(
                blocks.AddContext,
                {
                  mdxStoryNameToKey: mdxStoryNameToKey,
                  mdxComponentMeta: componentMeta,
                },
                Object(esm.mdx)(MDXContent, null)
              );
            },
          }
        ));
      __webpack_exports__.default = componentMeta;
    },
    987: function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(
          __webpack_exports__,
          "PermamentScroll",
          function() {
            return PermamentScroll;
          }
        ),
        __webpack_require__.d(
          __webpack_exports__,
          "NotPermamentScroll",
          function() {
            return NotPermamentScroll;
          }
        );
      __webpack_require__(3);
      var delegated_reactfrom_dll_reference_storybook_docs_dll = __webpack_require__(
          1
        ),
        delegated_reactfrom_dll_reference_storybook_docs_dll_default = __webpack_require__.n(
          delegated_reactfrom_dll_reference_storybook_docs_dll
        ),
        styled_components_browser_esm =
          (__webpack_require__(10), __webpack_require__(25)),
        delegated_prop_typesfrom_dll_reference_storybook_docs_dll = __webpack_require__(
          28
        ),
        delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default = __webpack_require__.n(
          delegated_prop_typesfrom_dll_reference_storybook_docs_dll
        ),
        react_router = __webpack_require__(363);
      function _extends() {
        return (_extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key]);
            }
            return target;
          }).apply(this, arguments);
      }
      function _objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var key,
          i,
          target = (function _objectWithoutPropertiesLoose(source, excluded) {
            if (null == source) return {};
            var key,
              i,
              target = {},
              sourceKeys = Object.keys(source);
            for (i = 0; i < sourceKeys.length; i++)
              (key = sourceKeys[i]),
                excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
          })(source, excluded);
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
              excluded.indexOf(key) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(source, key) &&
                  (target[key] = source[key]));
        }
        return target;
      }
      var ScrollPane = styled_components_browser_esm.b.div.withConfig({
          displayName: "ScrollPane",
          componentId: "l5f9wg-0",
        })(["width:100%;height:100%;overflow-y:auto;position:relative;"]),
        ScrollPane_StyledScrollPane = function StyledScrollPane(_ref) {
          var children = _ref.children,
            _ref$scrollToTop = _ref.scrollToTop,
            scrollToTop = void 0 !== _ref$scrollToTop && _ref$scrollToTop,
            otherProps = _objectWithoutProperties(_ref, [
              "children",
              "scrollToTop",
            ]),
            history = Object(react_router.c)(),
            ref = Object(
              delegated_reactfrom_dll_reference_storybook_docs_dll.useRef
            )();
          return (
            Object(
              delegated_reactfrom_dll_reference_storybook_docs_dll.useEffect
            )(function() {
              scrollToTop &&
                history.listen(function() {
                  var node = ref.current;
                  node && (node.scrollTop = 0);
                });
            }),
            delegated_reactfrom_dll_reference_storybook_docs_dll_default.a.createElement(
              ScrollPane,
              _extends({ ref: ref }, otherProps),
              children
            )
          );
        };
      (ScrollPane_StyledScrollPane.displayName = "StyledScrollPane"),
        (ScrollPane_StyledScrollPane.propTypes = {
          children:
            delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default.a
              .node,
          scrollToTop:
            delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default.a
              .bool,
        }),
        (ScrollPane_StyledScrollPane.__docgenInfo = {
          description: "",
          methods: [],
          displayName: "StyledScrollPane",
          props: {
            scrollToTop: {
              defaultValue: { value: "false", computed: !1 },
              type: { name: "bool" },
              required: !1,
              description: "",
            },
            children: { type: { name: "node" }, required: !1, description: "" },
          },
        });
      var components_ScrollPane = ScrollPane_StyledScrollPane;
      function ScrollPane_stories_extends() {
        return (ScrollPane_stories_extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key]);
            }
            return target;
          }).apply(this, arguments);
      }
      "undefined" != typeof STORYBOOK_REACT_CLASSES &&
        (STORYBOOK_REACT_CLASSES["src/components/ScrollPane/index.js"] = {
          name: "StyledScrollPane",
          docgenInfo: ScrollPane_StyledScrollPane.__docgenInfo,
          path: "src/components/ScrollPane/index.js",
        });
      __webpack_exports__.default = {
        title: "Patterns/Scroll Pane",
        component: components_ScrollPane,
        decorators: [
          function(Story) {
            return delegated_reactfrom_dll_reference_storybook_docs_dll_default.a.createElement(
              "div",
              { style: { height: "200px", width: "300px" } },
              delegated_reactfrom_dll_reference_storybook_docs_dll_default.a.createElement(
                Story,
                null
              )
            );
          },
        ],
      };
      var exampleText =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        ScrollPane_stories_innerText = function innerText() {
          var label =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : exampleText;
          return delegated_reactfrom_dll_reference_storybook_docs_dll_default.a.createElement(
            "textarea",
            { style: { resize: "both" } },
            label
          );
        };
      ScrollPane_stories_innerText.displayName = "innerText";
      var ScrollPane_stories_Template = function Template(args) {
        return delegated_reactfrom_dll_reference_storybook_docs_dll_default.a.createElement(
          components_ScrollPane,
          args
        );
      };
      ScrollPane_stories_Template.displayName = "Template";
      var PermamentScroll = ScrollPane_stories_Template.bind({});
      PermamentScroll.args = {
        permanentScrollBar: !0,
        children: [ScrollPane_stories_innerText()],
      };
      var NotPermamentScroll = ScrollPane_stories_Template.bind({});
      (NotPermamentScroll.args = {
        permanentScrollBar: !1,
        children: [ScrollPane_stories_innerText()],
      }),
        (PermamentScroll.parameters = ScrollPane_stories_extends(
          { storySource: { source: "args => <ScrollPane {...args} />" } },
          PermamentScroll.parameters
        )),
        (NotPermamentScroll.parameters = ScrollPane_stories_extends(
          { storySource: { source: "args => <ScrollPane {...args} />" } },
          NotPermamentScroll.parameters
        ));
    },
    988: function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, "Horizontal", function() {
          return Horizontal;
        }),
        __webpack_require__.d(__webpack_exports__, "Vertical", function() {
          return Vertical;
        }),
        __webpack_require__.d(__webpack_exports__, "AlignRight", function() {
          return ButtonGroup_stories_AlignRight;
        });
      __webpack_require__(3);
      var delegated_reactfrom_dll_reference_storybook_docs_dll = __webpack_require__(
          1
        ),
        delegated_reactfrom_dll_reference_storybook_docs_dll_default = __webpack_require__.n(
          delegated_reactfrom_dll_reference_storybook_docs_dll
        ),
        delegated_prop_typesfrom_dll_reference_storybook_docs_dll =
          (__webpack_require__(10), __webpack_require__(28)),
        delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default = __webpack_require__.n(
          delegated_prop_typesfrom_dll_reference_storybook_docs_dll
        ),
        styled_components_browser_esm = __webpack_require__(25);
      function _extends() {
        return (_extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key]);
            }
            return target;
          }).apply(this, arguments);
      }
      function _objectWithoutProperties(source, excluded) {
        if (null == source) return {};
        var key,
          i,
          target = (function _objectWithoutPropertiesLoose(source, excluded) {
            if (null == source) return {};
            var key,
              i,
              target = {},
              sourceKeys = Object.keys(source);
            for (i = 0; i < sourceKeys.length; i++)
              (key = sourceKeys[i]),
                excluded.indexOf(key) >= 0 || (target[key] = source[key]);
            return target;
          })(source, excluded);
        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
          for (i = 0; i < sourceSymbolKeys.length; i++)
            (key = sourceSymbolKeys[i]),
              excluded.indexOf(key) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(source, key) &&
                  (target[key] = source[key]));
        }
        return target;
      }
      var VerticalGroup = Object(styled_components_browser_esm.a)([
          "flex-direction:column;",
        ]),
        HorizontalGroup = Object(styled_components_browser_esm.a)(
          ["flex-direction:row;>:not(:last-child){margin-right:", ";}"],
          function(props) {
            return props.gutter ? props.gutter : "1em";
          }
        ),
        AlignRight = Object(styled_components_browser_esm.a)([
          "justify-content:flex-end;",
        ]),
        StyledButtonGroup = styled_components_browser_esm.b.div.withConfig({
          displayName: "ButtonGroup__StyledButtonGroup",
          componentId: "bg6iiz-0",
        })(
          ["display:flex;flex-direction:column;", ";", ";", ";"],
          function(props) {
            return props.vertical && VerticalGroup;
          },
          function(props) {
            return props.horizontal && HorizontalGroup;
          },
          function(props) {
            return "right" === props.align && AlignRight;
          }
        ),
        ButtonGroup_ButtonGroup = function ButtonGroup(_ref) {
          var children = _ref.children,
            otherProps = _objectWithoutProperties(_ref, ["children"]);
          return delegated_reactfrom_dll_reference_storybook_docs_dll_default.a.createElement(
            StyledButtonGroup,
            _extends({ "data-test": "button-group" }, otherProps),
            children
          );
        };
      (ButtonGroup_ButtonGroup.displayName = "ButtonGroup"),
        (ButtonGroup_ButtonGroup.propTypes = {
          children:
            delegated_prop_typesfrom_dll_reference_storybook_docs_dll_default.a
              .node,
        }),
        (ButtonGroup_ButtonGroup.__docgenInfo = {
          description: "",
          methods: [],
          displayName: "ButtonGroup",
          props: {
            children: { type: { name: "node" }, required: !1, description: "" },
          },
        });
      var buttons_ButtonGroup = ButtonGroup_ButtonGroup;
      "undefined" != typeof STORYBOOK_REACT_CLASSES &&
        (STORYBOOK_REACT_CLASSES[
          "src/components/buttons/ButtonGroup/index.js"
        ] = {
          name: "ButtonGroup",
          docgenInfo: ButtonGroup_ButtonGroup.__docgenInfo,
          path: "src/components/buttons/ButtonGroup/index.js",
        });
      var Button = __webpack_require__(23);
      function ButtonGroup_stories_extends() {
        return (ButtonGroup_stories_extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key]);
            }
            return target;
          }).apply(this, arguments);
      }
      __webpack_exports__.default = {
        title: "Patterns/Button Group",
        component: buttons_ButtonGroup,
      };
      var ButtonGroup_stories_button = function button() {
        var label =
          arguments.length > 0 && void 0 !== arguments[0]
            ? arguments[0]
            : "Button";
        return delegated_reactfrom_dll_reference_storybook_docs_dll_default.a.createElement(
          Button.a,
          null,
          label
        );
      };
      ButtonGroup_stories_button.displayName = "button";
      var ButtonGroup_stories_Template = function Template(args) {
        return delegated_reactfrom_dll_reference_storybook_docs_dll_default.a.createElement(
          buttons_ButtonGroup,
          args
        );
      };
      ButtonGroup_stories_Template.displayName = "Template";
      var Horizontal = ButtonGroup_stories_Template.bind({});
      Horizontal.args = {
        horizontal: !0,
        children: [
          ButtonGroup_stories_button("First"),
          ButtonGroup_stories_button("Second"),
        ],
      };
      var Vertical = ButtonGroup_stories_Template.bind({});
      Vertical.args = {
        vertical: !0,
        children: [
          ButtonGroup_stories_button("First"),
          ButtonGroup_stories_button("Second"),
        ],
      };
      var ButtonGroup_stories_AlignRight = ButtonGroup_stories_Template.bind(
        {}
      );
      (ButtonGroup_stories_AlignRight.args = {
        horizontal: !0,
        align: "right",
        children: [
          ButtonGroup_stories_button("First"),
          ButtonGroup_stories_button("Second"),
        ],
      }),
        (Horizontal.parameters = ButtonGroup_stories_extends(
          { storySource: { source: "args => <ButtonGroup {...args} />" } },
          Horizontal.parameters
        )),
        (Vertical.parameters = ButtonGroup_stories_extends(
          { storySource: { source: "args => <ButtonGroup {...args} />" } },
          Vertical.parameters
        )),
        (ButtonGroup_stories_AlignRight.parameters = ButtonGroup_stories_extends(
          { storySource: { source: "args => <ButtonGroup {...args} />" } },
          ButtonGroup_stories_AlignRight.parameters
        ));
    },
  },
  [[365, 1, 2]],
]);
//# sourceMappingURL=main.05459788903fcff24fce.bundle.js.map
