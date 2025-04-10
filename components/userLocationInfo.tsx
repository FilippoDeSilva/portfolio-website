import { useEffect, useState } from "react";

export function useUserLocationInfo() {
  const [name, setName] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState("/resume-default.pdf");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");

        if (!res.ok) {
          throw new Error(`Failed to fetch IP data: ${res.status}`);
        }

        const data = await res.json();
        const countryRaw = data.country_name;
        const country = countryRaw?.trim().toLowerCase();

        if (country === "ethiopia") {
          setName("Samuel Dagnachew");
          setResumeUrl("/resume.pdf");
        } else {
          setName("Filippo De Silva");
          setResumeUrl("/resume-default.pdf");
        }

      } catch (error) {
        setName("Filippo De Silva");
        setResumeUrl("/resume-default.pdf"); // fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountry();
  }, []);

  return { name, resumeUrl, isLoading };
}
