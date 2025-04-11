'use client'

import React from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function DocsPage() {
  return (
    <div className="p-8">
      <SwaggerUI url="/openapi.json" />
    </div>
  )
}
