
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
// This function is a utility from shadcn/ui.
// You need to install `clsx` and `tailwind-merge` for it to work.
// npm install clsx tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
