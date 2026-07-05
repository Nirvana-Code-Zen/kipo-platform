'use client'

import { Button } from "@kipo/ui-react"

import { Header } from "@/src/shared/ui/components/dashboard/header"
import { MobileAppCard } from "@/src/shared/ui/components/dashboard/mobile-app-card"
import { ProjectAnalytics } from "@/src/shared/ui/components/dashboard/project-analytics"
import { ProjectList } from "@/src/shared/ui/components/dashboard/project-list"
import { ProjectProgress } from "@/src/shared/ui/components/dashboard/project-progress"
import { Reminders } from "@/src/shared/ui/components/dashboard/reminders"
import { StatsCards } from "@/src/shared/ui/components/dashboard/stats-cards"
import { TeamCollaboration } from "@/src/shared/ui/components/dashboard/team-collaboration"
import { TimeTracker } from "@/src/shared/ui/components/dashboard/time-tracker"

export function Dashboard() {
    return (
      <>
        <Header
          title="Dashboard"
          description="Plan, prioritize, and accomplish your tasks with ease."
          actions={
            <>
              <Button className="w-full sm:w-auto h-9 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105">
                + Add Project
              </Button>
              <Button
                variant="ghost"
                className="w-full sm:w-auto h-9 text-sm transition-all duration-300 hover:shadow-md hover:scale-105 bg-transparent"
              >
                Import Data
              </Button>
            </>
          }
        />

        <div className="mt-4 md:mt-5 space-y-3 md:space-y-4">
          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              <ProjectAnalytics />
              <TeamCollaboration />
            </div>

            <div className="space-y-3 md:space-y-4">
              <Reminders />
              <ProjectProgress />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <ProjectList />
            <MobileAppCard />
            <TimeTracker />
          </div>
        </div>
    </>
    )
}


