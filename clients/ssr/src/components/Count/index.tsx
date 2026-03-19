'use client';

import { useState } from 'react'

export function Count() {
  const [value,setValue] = useState(0);

  return <div>
    <div>
  {value}
    </div>
    <hr />
    <div>
    <button>+</button>
    <button>-</button>
    </div>
  </div>
}