import {isEmpty, isUndefined} from "lodash";
import {bcMath} from "@/utils/utils";
import dayjs, {isDayjs} from "dayjs";

const pqiFormulasFactory = () => {
  return {
    getVatRate: (type) => {
      let rate = 0.09;
      if (type === 4) {
        rate = 0.06;
      }

      return rate;
    },
    profitRateToProfit: (cost, pr) => {
      return bcMath.div((cost * (pr / 100)), (1 - (pr / 100)), 2);
    },
    profitRateToExVat: (cost, pr) => {
      return bcMath.add(parseFloat(cost), (((pr / 100) * cost) / (1 - (pr / 100))), 2)
    },
    profitRateToVat: function (cost, pr, type) {
      return bcMath.mul(this.profitRateToExVat(cost, pr), this.getVatRate(type), 2);
    },
    profitRateToInVat: function (cost, pr, type) {
      return bcMath.mul(this.profitRateToExVat(cost, pr), (this.getVatRate(type) + 1), 2);
    },
    profitToOther: function (cost, p, type) {
      const exVat = bcMath.add(parseFloat(cost), parseFloat(p), 2)
      const vat = bcMath.mul(this.getVatRate(type), exVat, 2)
      const inVat = bcMath.mul((this.getVatRate(type) + 1), exVat, 2)
      const profitRate = bcMath.mul((p / exVat), 100, 2)
      return {
        exVat,
        vat,
        inVat,
        profitRate
      }
    },
    vatToOther: function (cost, vat, type) {
      const exVat = bcMath.div(vat, this.getVatRate(type), 2)
      const inVat = bcMath.add(parseFloat(exVat), parseFloat(vat), 2);
      const profit = bcMath.sub(exVat, cost, 2)
      const profitRate = bcMath.mul((parseFloat(profit) / parseFloat(exVat)), 100, 2);
      return {
        exVat,
        profitRate,
        profit,
        inVat
      }
    },
    exVatToOther: function (cost, exVat, type) {
      const profit = bcMath.sub(exVat, cost, 2)
      const profitRate = bcMath.mul((parseFloat(profit) / exVat), 100, 2);
      const vat = bcMath.mul(this.getVatRate(type), exVat, 2)
      const inVat = bcMath.mul((this.getVatRate(type) + 1), exVat, 2)
      return {
        profit,
        profitRate,
        vat,
        inVat
      }
    },
    inVatToOther: function (cost, inVat, type) {
      const exVat = bcMath.div(inVat, (this.getVatRate(type) + 1), 2)
      const profit = bcMath.sub(exVat, cost)
      const profitRate = bcMath.mul((parseFloat(profit) / parseFloat(exVat)), 100, 2)
      const vat = bcMath.mul(this.getVatRate(type), exVat, 2)
      return {
        exVat,
        profit,
        profitRate,
        vat
      }
    },
    inputToOther: (value, vat, totalItem, type = 'price', method = 'collect', defaultCost = '0') => {
      // const price = 'price' === type ? value : parseFloat(bcMath.div((value * totalItem.price), 100, 2)).toFixed(2)
      // 新改写（原因：当cost改动时，price不应该被计算，应该保持不变）
      const price = 'price' === type ? value : totalItem.price

      let percent = 'percent' === type ? value : totalItem.price > 0 ? (parseFloat(bcMath.div(price, totalItem.price, 4)) * 100).toFixed(2) : 0;
      if (method === 'vo') {
        percent = 100
      }

      const tax = parseFloat(bcMath.div((price * vat), 100, 2)).toFixed(2)
      const subTotal = parseFloat(bcMath.mul(price, (1 + (vat / 100)), 2)).toFixed(2)
      let cost = parseFloat(bcMath.mul(totalItem.cost_price, (percent / 100), 2)).toFixed(2)
      if (method === 'vo') {
        cost = type === 'cost_price' ? value : defaultCost
      }


      const profit = parseFloat(bcMath.sub(price, parseFloat(cost), 2)).toFixed(2)

      // const profitRate = parseFloat(bcMath.div(profit, price, 4) * 100).toFixed(2)
      // 新改写（原因：当price为 '0' | '' | '-0' 时，不应该参与计算）
      const profitRate = price !== '' && price !== '0' && price !== '-0' ? parseFloat(bcMath.div(profit, price, 4) * 100).toFixed(2) : '0'

      console.log('profit', profit)

      return {
        price,
        percent,
        tax,
        subTotal,
        cost,
        profit,
        profitRate
      }
    },
    calculateAreaUnit: (unitVal: string, area?: number) => {
      if (isUndefined(area) || area <= 0 || (unitVal !== "sqm" && unitVal !== "sq.ft")) {
        return 0
      }

      if (unitVal === "sqm") {
        return bcMath.mul(area, 0.092903, 2)
      }

      return bcMath.mul(area, 10.7639, 2)
    },
    calculateWorkDays: (timeRanges) => {
      let totalDays = 0;
      if (isEmpty(timeRanges)) {
        return totalDays
      }

      timeRanges.forEach((item) => {
        if (isEmpty(item) || isEmpty(item?.date)) {
          return
        }

        const [startDate, endDate] = item.date
        if ("" === startDate || "" === endDate) {
          return;
        }

        let days = (!isDayjs(endDate) ? dayjs(endDate) : endDate).diff((!isDayjs(startDate) ? dayjs(startDate) : startDate), 'day') + 1
        console.log("days:", days)
        totalDays += days; // 累加到总天数
      })

      return totalDays
    }
  };
};


const pqiFormulas = pqiFormulasFactory();
export default pqiFormulas;

// // 导入 pqiFormulas 对象
// import pqiFormulas from './pqiFormulas';
//
// // 使用 pqiFormulas 对象的方法
// const vatRate = pqiFormulas.getVatRate(4);
