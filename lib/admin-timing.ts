import { NextResponse } from "next/server";

// High-Precision Performance Monitoring - Built by jaydev
// Timings contain durations only, never account details or database credentials.
export class AdminTiming {
  private started = performance.now();
  private phases: string[] = [];
  async measure<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const started = performance.now();
    try {
      return await operation();
    } finally {
      this.phases.push(
        `${name};dur=${(performance.now() - started).toFixed(1)}`
      );
    }
  }
  json(body: unknown, status = 200) {
    const response = NextResponse.json(body, { status });
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set(
      "Server-Timing",
      [
        ...this.phases,
        `total;dur=${(performance.now() - this.started).toFixed(1)}`,
      ].join(", ")
    );
    return response;
  }
}
