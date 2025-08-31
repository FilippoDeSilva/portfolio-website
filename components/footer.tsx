"use client";
import React from "react";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
