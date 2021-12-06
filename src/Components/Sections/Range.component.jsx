import React, { useState, useEffect } from "react";
import s from "./Style/Range.module.scss"; // s for style

/**
 *
 * @param {Number} min
 * @param {Number} max
 * @param {StaticRange} setMin - setState
 * @param {StaticRange} setMax - setState
 * @param {Number} length - Length of range (in px)
 * @returns
 */

export const Range = ({ min, max, setMin, setMax, length = 100 }) => {
  // Create our number formatter.
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // States
  const [current, setCurrent] = useState({ min: min, max: 100 });
  const [target, setTarget] = useState(null);
  const [selected, setSelected] = useState(null);

  // Set min and max values when a sliders are moved
  useEffect(() => {
    setMin(Number(current.min * (max / 100)));
    setMax(Number(current.max * (max / 100)));
  }, [current.min, current.max, setMin, setMax, max]);

  const checkMotion = (e) => {
    e.preventDefault(); // Prevent default behavior

    // Make sure the selected target is our current target
    if (selected === e.target) {
      e.target.addEventListener("mousemove", moving);
    }

    // Remove eventlistner on certain events
    // *Mouse Up & *Mouse Leave (set to target)

    e.target.addEventListener("mouseup", () => {
      e.target.removeEventListener("mousemove", moving);
    });

    e.target.addEventListener("mouseleave", () => {
      e.target.removeEventListener("mousemove", moving);
    });
  };

  // Set oldx outside to make sure it changes.
  let oldx = 0;
  function moving(e) {
    let medium = 15; // How much percantage there can be between the two

    /**
     *
     * @param {event} e - event
     * @param {Number} min - Limit to where it can go back to on the range
     * @param {Number} max - Limit to where it can go to on the range
     * @param {String} value - To check which slider it is (min or max)
     */
    const moved = (e, min, max, value) => {
      // Right direction
      if (
        oldx > e.clientX &&
        (Number(e.target.style.left.replace("%", "")) > min ||
          Number(e.target.style.left.replace("%", "")) > max)
      ) {
        // Ternary condition operators, which checks for current placement and moves backward.
        setCurrent({
          min:
            value === "min"
              ? Number(e.target.style.left.replace("%", "")) - 1
              : current.min,
          max:
            value === "max"
              ? Number(e.target.style.left.replace("%", "")) - 1
              : current.max,
        });
      }

      // Left direction
      if (
        oldx < e.clientX &&
        (Number(e.target.style.left.replace("%", "")) < min ||
          Number(e.target.style.left.replace("%", "")) < max)
      ) {
        // Ternary condition operators, which checks for current placement and moves forward.

        setCurrent({
          min:
            value === "min"
              ? Number(e.target.style.left.replace("%", "")) + 1
              : current.min,
          max:
            value === "max"
              ? Number(e.target.style.left.replace("%", "")) + 1
              : current.max,
        });
      }

      // Collision detector (set the medium above to adjust how close in percantage the sliders can be)
      if (
        value === "min"
          ? current.max - Number(e.target.style.left.replace("%", "")) ===
            medium
          : Number(e.target.style.left.replace("%", "")) - current.min ===
            medium
      ) {
        // Ternary condition operators, which checks for current placement and moves forward and backward depending on the *value parameter.
        setCurrent({
          min:
            value === "min"
              ? Number(e.target.style.left.replace("%", "")) - 1
              : current.min,
          max:
            value === "max"
              ? Number(e.target.style.left.replace("%", "")) + 1
              : current.max,
        });
      }

      // Set old mouse placement to check which direction the mouse is being taken
      oldx = e.clientX;
    };

    // Check current target
    if (target === "min") {
      moved(e, 0, 100, "min");
    }

    if (target === "max") {
      moved(e, 100, 0, "max");
    }
  }

  // Create slider
  return (
    <>
      <div className={s.range} style={{ width: `${length}px` }}>
        {/**Min & Max values */}
        {/**Min */}
        <span className={s.container}>
          <div
            className={s.min}
            onMouseOver={(e) => {
              setTarget("min");
              setSelected(e.target);
            }}
            onMouseLeave={() => setTarget(null)}
            onMouseDown={checkMotion}
            style={{ left: current.min + "%" }}
          >
            {/**Show amount*/}
            {Number(current.min * (max / 100)) !== min && current.min !== 0 && (
              <div className={s.showcase}>
                {formatter
                  .format(Number(current.min * (max / 100)))
                  .replace("$", "")}
              </div>
            )}
          </div>
        </span>
        {/**Max */}
        <span className={s.container}>
          <div
            className={s.max}
            onMouseOver={(e) => {
              setTarget("max");
              setSelected(e.target);
            }}
            onMouseLeave={() => setTarget(null)}
            onMouseDown={checkMotion}
            style={{ left: current.max + "%" }}
          >
            {/**Show amount*/}

            {Number(current.max * (max / 100)) !== max &&
              current.max !== 100 && (
                <div className={s.showcase}>
                  {formatter
                    .format(Number(current.max * (max / 100)))
                    .replace("$", "")}
                </div>
              )}
          </div>
        </span>
      </div>
    </>
  );
};
