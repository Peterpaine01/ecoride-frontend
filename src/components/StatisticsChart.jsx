import React, { useEffect, useState } from "react"
import axios from "../config/axiosConfig"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  format,
  startOfWeek,
  endOfWeek,
  addMonths,
  addWeeks,
  addYears,
  subMonths,
  subWeeks,
  subYears,
  parse,
} from "date-fns"
import { fr } from "date-fns/locale"

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

function StatisticsChart() {
  const [period, setPeriod] = useState("monthly")
  const [selectedValue, setSelectedValue] = useState(
    format(new Date(), "yyyy-MM")
  )
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [period, selectedValue])

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `/statistics/details?period=${period}&value=${selectedValue}`
      )
      setData(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePrev = () => {
    if (period === "monthly") {
      setSelectedValue(
        format(
          subMonths(parse(selectedValue, "yyyy-MM", new Date()), 1),
          "yyyy-MM"
        )
      )
    } else if (period === "weekly") {
      const [year, week] = selectedValue.split("-")
      const date = parse(`${year}-${week}`, "RRRR-II", new Date())
      const newDate = subWeeks(date, 1)
      setSelectedValue(format(newDate, "RRRR-II"))
    } else if (period === "yearly") {
      setSelectedValue((prev) => `${parseInt(prev) - 1}`)
    }
  }

  const handleNext = () => {
    if (period === "monthly") {
      setSelectedValue(
        format(
          addMonths(parse(selectedValue, "yyyy-MM", new Date()), 1),
          "yyyy-MM"
        )
      )
    } else if (period === "weekly") {
      const [year, week] = selectedValue.split("-")
      const date = parse(`${year}-${week}`, "RRRR-II", new Date())
      const newDate = addWeeks(date, 1)
      setSelectedValue(format(newDate, "RRRR-II"))
    } else if (period === "yearly") {
      setSelectedValue((prev) => `${parseInt(prev) + 1}`)
    }
  }

  const formatWeekLabel = (weekStr) => {
    try {
      const date = parse(weekStr, "RRRR-II", new Date())
      const start = startOfWeek(date, { locale: fr, weekStartsOn: 1 })
      const end = endOfWeek(date, { locale: fr, weekStartsOn: 1 })

      return `${format(start, "eee d", { locale: fr })} au ${format(
        end,
        "eee d yyyy",
        {
          locale: fr,
        }
      )}`
    } catch {
      return weekStr
    }
  }

  const formatDay = (dateString) => {
    try {
      return format(new Date(dateString), "d", { locale: fr })
    } catch {
      return dateString
    }
  }

  return (
    <div className="chart-stats">
      {/* Graphique */}
      <div className="dotted" style={{ paddingRight: "40px" }}>
        {/* Navigation */}
        <div className="flex-row justify-center align-center mb-20 gap-15">
          <button
            onClick={handlePrev}
            className="btn-text"
            aria-label="Précédent"
          >
            <KeyboardArrowLeftIcon />
          </button>

          <p className="text-white mb-5">
            {period === "weekly"
              ? formatWeekLabel(selectedValue)
              : period === "monthly"
              ? format(
                  parse(selectedValue, "yyyy-MM", new Date()),
                  "MMMM yyyy",
                  {
                    locale: fr,
                  }
                )
              : period === "yearly"
              ? selectedValue
              : selectedValue}
          </p>

          <button
            onClick={handleNext}
            className="btn-text"
            aria-label="Suivant"
          >
            <KeyboardArrowRightIcon />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#678eae" />
            <XAxis
              dataKey="day"
              stroke="#fff"
              tickFormatter={(value) =>
                period === "yearly" ? formatDay(value) : formatDay(value)
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis type="number" stroke="#fff" domain={["auto", "auto"]} />

            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="daily_benefits"
              name="Bénéfices (crédits)"
              stroke="#f7c134"
            />
            <Line
              type="monotone"
              dataKey="total_rides"
              name="Trajets"
              stroke="#82ca9d"
            />
          </LineChart>
        </ResponsiveContainer>
        <hr className="mt-20" />
        {/* Choix période */}
        <div className="flex-row gap-15 justify-center align-center mt-20">
          {["weekly", "monthly", "yearly"].map((p) => (
            <button
              key={p}
              className={`${period === p ? "btn-solid" : "btn-light"}`}
              onClick={() => {
                setPeriod(p)
                if (p === "weekly")
                  setSelectedValue(format(new Date(), "RRRR-II"))
                else if (p === "monthly")
                  setSelectedValue(format(new Date(), "yyyy-MM"))
                else if (p === "yearly")
                  setSelectedValue(format(new Date(), "yyyy"))
              }}
            >
              {p === "weekly" && "Hebdomadaire"}
              {p === "monthly" && "Mensuel"}
              {p === "yearly" && "Annuel"}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatisticsChart
