"use client"

import { useState } from "react"

import { Card } from "@kipo/ui-react"
import { TrendingUp, TrendingDown, Users, CheckCircle, Clock, Target, ArrowUpRight } from "lucide-react"

const stats = [
  { title: "Total Tasks Completed", value: "247", change: "+12%", trend: "up",   icon: CheckCircle },
  { title: "Active Projects",       value: "12",  change: "+3",   trend: "up",   icon: Target },
  { title: "Team Members",          value: "24",  change: "-2",   trend: "down", icon: Users },
  { title: "Avg. Completion Time",  value: "2.3", subtitle: "days", change: "-0.5", trend: "up", icon: Clock },
]

const monthlyData = [
  { month: "Jan", tasks: 45, projects: 8,  barWidth: "w-[67.16%]", delay: "[animation-delay:0ms]" },
  { month: "Feb", tasks: 52, projects: 9,  barWidth: "w-[77.61%]", delay: "[animation-delay:50ms]" },
  { month: "Mar", tasks: 48, projects: 10, barWidth: "w-[71.64%]", delay: "[animation-delay:100ms]" },
  { month: "Apr", tasks: 61, projects: 11, barWidth: "w-[91.04%]", delay: "[animation-delay:150ms]" },
  { month: "May", tasks: 55, projects: 12, barWidth: "w-[82.09%]", delay: "[animation-delay:200ms]" },
  { month: "Jun", tasks: 67, projects: 12, barWidth: "w-full",     delay: "[animation-delay:250ms]" },
]

const STAT_CARD_DELAYS = ["delay-0", "delay-100", "delay-200", "delay-300"] as const

const PROJECT_DELAYS = ["delay-0", "delay-100", "delay-200", "delay-300"] as const

export function AnalyticsContent() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`bg-card text-foreground p-4 transition-all duration-500 ease-out animate-slide-in-up cursor-pointer ${STAT_CARD_DELAYS[index]} ${
              hoveredCard === index ? "scale-105 shadow-2xl" : "shadow-lg"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xs font-medium opacity-90">{stat.title}</h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full bg-primary flex items-center justify-center transition-transform duration-300 ${
                  hoveredCard === index ? "rotate-45" : ""
                }`}
              >
                <ArrowUpRight className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-2">
              {stat.value}
              {stat.subtitle && <span className="text-base font-normal ml-1">{stat.subtitle}</span>}
            </p>
            <div className="flex items-center gap-1.5 text-xs opacity-80">
              {stat.trend === "up" ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
              <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">Monthly Task Completion</h3>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div
                key={data.month}
                className={`space-y-2 animate-slide-in ${data.delay}`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{data.month}</span>
                  <span className="text-muted-foreground">{data.tasks} tasks</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-primary rounded-full transition-all duration-1000 ease-out ${data.barWidth}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">Project Distribution</h3>
          <div className="space-y-4">
            {[
              { name: "In Progress", count: 8,  color: "bg-blue-500" },
              { name: "Completed",   count: 15, color: "bg-green-600" },
              { name: "Pending",     count: 5,  color: "bg-amber-500" },
              { name: "On Hold",     count: 2,  color: "bg-gray-500" },
            ].map((item, index) => (
              <div
                key={item.name}
                className={`flex items-center justify-between p-3 rounded-lg border border-border hover:shadow-md transition-all duration-300 animate-slide-in ${PROJECT_DELAYS[index]}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
