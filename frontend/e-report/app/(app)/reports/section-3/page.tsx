'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AppTable from "@/components/layout/table/app-table"
import { useState } from "react"

export default function Section() {

    const [formName, setFormName] = useState<string>("Section-3")


    return <section className="flex flex-col space-y-14">

        <div className="flex flex-col space-y-8">
            <div>
                <p className="text-2xl google-sans-thin px-8">{formName}</p>
            </div>

            <div className="flex flex-row items-center justify-between px-8">
                <Input placeholder="search reports" className="w-[300px] border-neutral-400/80 dark:border-neutral-50/10" />
                <Button>New</Button>
            </div>
        </div>


        <div className="px-8">
            <AppTable></AppTable>
        </div>
    </section>
}