# Unit Test Planning: Amrita Placement Tracker

This document outlines the strategic plan for unit testing the application, focusing on critical business logic, security protocols, and user interface states.

## 🔑 1. Authentication & Security (Backend)
**Objective:** Validate that the identity management system is secure and stateful.

| Test Scenario ID | Description | Expected Outcome |
| :--- | :--- | :--- |
| **AUTH-01** | Login with valid Amrita credentials. | A valid JWT token is issued and user object (email/role) is returned. |
| **AUTH-02** | Login with non-existent email. | System returns a '401 Unauthorized' and suggests credential check. |
| **AUTH-03** | Incorrect password attempt (Student). | Failed attempts counter increments by 1; system remains unlocked. |
| **AUTH-04** | Fifth consecutive failed attempt (Admin). | The `isLocked` flag on the user record changes to `true`. |
| **AUTH-05** | Login attempt on a locked account. | System returns '403 Forbidden' with a specific "Account Locked" message. |

---

## 🎓 2. Placement Eligibility Logic (Backend)
**Objective:** Ensure the automated "gatekeeper" logic correctly filters students for company drives.

| Test Scenario ID | Description | Expected Outcome |
| :--- | :--- | :--- |
| **ELIG-01** | CGPA lower than drive threshold. | Eligibility check returns `false` with the specific CGPA error message. |
| **ELIG-02** | CGPA exactly equal to threshold. | Eligibility check returns `true` (Boundary value test). |
| **ELIG-03** | Department mismatch. | Eligibility check returns `false` if student's dept is not in `allowedDepartments`. |
| **ELIG-04** | Backlog limit exceeded. | Application is blocked if student backlogs > drive's `maxBacklogs`. |
| **ELIG-05** | Duplicate application attempt. | System returns '400 Bad Request' if a student tries to apply twice to the same drive. |

---

## 🧠 3. AI Readiness Algorithm (Service Level)
**Objective:** Verify the mathematical precision of career advice calculations.

| Test Scenario ID | Description | Expected Outcome |
| :--- | :--- | :--- |
| **AI-01** | Maximum score calculation. | A student with 10.0 CGPA and 4+ skills reaches the 100-point cap. |
| **AI-02** | Skill weightage capping. | Adding 10 skills does not exceed the 40-point skill contribution limit. |
| **AI-03** | Backlog penalty application. | Score is deducted by exactly 20 points for any count of active backlogs. |
| **AI-04** | Minimum score floor. | Extremely poor metrics result in a score of 0, never a negative number. |

---

## 🖥️ 4. Frontend UI & Interaction (React Components)
**Objective:** Ensure the user experience reflects the true state of the application.

| Test Scenario ID | Description | Expected Outcome |
| :--- | :--- | :--- |
| **UI-01** | Drive Card: Eligibility Banner. | Card displays a green "Eligible" checkmark when `isEligible` property is true. |
| **UI-02** | Drive Card: Action Button. | "Apply Now" button is hidden if the student has already applied or is ineligible. |
| **UI-03** | Dashboard: Counter Animation. | The `Counter` component transitions from 0 to the fetched numeric value. |
| **UI-04** | Search Filter: Company Name. | The list of drives updates in real-time as the user types in the search bar. |
| **UI-05** | AI Chatbot: Loading State. | A pulsing animation (Zap icon) is visible only while the API request is pending. |

---

## 📈 5. Test Data Requirements
To successfully execute this plan, we need the following mock data sets:
1.  **Student Profile A:** 9.5 CGPA, CSE Dept, 0 Backlogs (The "Eligible" candidate).
2.  **Student Profile B:** 6.0 CGPA, ME Dept, 2 Backlogs (The "Ineligible" candidate).
3.  **Drive Alpha:** Strict requirements (8.5 CGPA, 0 Backlogs).
4.  **Drive Beta:** Relaxed requirements (6.0 CGPA, 5 Backlogs).
