"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from 'next/dynamic'
import CaseReplace from "./CaseReplace"

const CaseTab = dynamic(() => import('@/components/case/CaseTab'))

const tabs = [
  {
    label: "Case",
    comp: <CaseTab />
  },
  {
    label: "Replace",
    comp: <CaseReplace />
  }
]

const TabsSection = () => (
  <Tabs defaultValue={tabs[0].label} >
    <div className="container mt-3">
      <TabsList>
        {tabs.map(tab =>
          <TabsTrigger
            value={tab.label}
            key={tab.label}
          >
            {tab.label}
          </TabsTrigger>
        )}
      </TabsList>
    </div>
    {tabs.map(tab =>
      <TabsContent
        key={tab.label}
        value={tab.label}
      >
        {tab.comp}
      </TabsContent>
    )}
  </Tabs>
)
export default TabsSection
