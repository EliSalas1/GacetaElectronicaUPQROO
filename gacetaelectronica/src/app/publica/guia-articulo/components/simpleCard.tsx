import React from "react"

interface SimpleCardProps {
  number?: string
  title: string
  text: React.ReactNode
}

export default function SimpleCard({ number, title, text }: SimpleCardProps) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
        {number && (
          <span className="inline-block bg-blue-100 text-blue-600 rounded-full w-6 h-6 text-sm flex items-center justify-center font-bold">
            {number}
          </span>
        )}
        {title}
      </h2>
      <div className="text-sm text-gray-700 leading-relaxed">
        {text}
      </div>
    </section>
  )
}
