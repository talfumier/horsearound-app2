import {useState} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {useEffect} from "react";

function PriceSlider({filter, onHandleChange}) {
  const Range = Slider.createSliderWithTooltip(Slider.Range);
  const [state, setState] = useState([]);
  useEffect(() => {
    let range = [0, 10000],
      cs = 0;
    if (Object.keys(filter.price.priceRange).length === 2) {
      range = [filter.price.priceRange["0"], filter.price.priceRange["1"]];
      cs = 1;
    }
    if (cs === 0) onHandleChange(range);
    setState(range);
  }, []);
  function onChange(range) {
    setState(range);
    onHandleChange(range);
  }
  return (
    state.length === 2 && (
      <Range
        style={{width: 600, margin: 50}}
        allowCross={false}
        min={0}
        max={10000}
        marks={{
          0: {
            style: {
              color: "#7AA095",
            },
            label: <strong>0€</strong>,
          },
          10000: {
            style: {
              color: "#7AA095",
            },
            label: <strong>10000€</strong>,
          },
        }}
        defaultValue={state}
        tipFormatter={(value) => <span className="p">{value}€</span>}
        toolTipVisibleAlways={true}
        tipProps={{visible: true}}
        onChange={onChange}
        step={100}
        trackStyle={[{backgroundColor: "#7AA095"}, {backgroundColor: ""}]}
        handleStyle={{backgroundColor: "#7AA095", borderColor: "#7AA095"}}
        railStyle={{backgroundColor: "#cbcaca"}}
      ></Range>
    )
  );
}

export default PriceSlider;
