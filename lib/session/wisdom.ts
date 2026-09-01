import { isWisdomSharingAge } from "@/lib/validation/age";

/** Target-age fields stay empty when offering from the 75–100 wisdom path. */
export function contributionPrefillForWisdom(fromWisdom: boolean, sessionAge: string): string {
  if (fromWisdom) {
    return "";
  }
  return sessionAge;
}

export function shouldEnterWisdomSharing(age: number): boolean {
  return isWisdomSharingAge(age);
}