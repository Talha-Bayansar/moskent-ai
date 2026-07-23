# Moskent

Moskent is an ecosystem for managing the people, work, and operations of mosque communities.

## Language

**Mosque Organization**:
An independently governed mosque community that uses Moskent for its internal operations. Moskent may serve many separate Mosque Organizations, but each remains its own organizational boundary.
_Avoid_: Mosque account, tenant, building

**Moskent Copilot**:
The permission-aware AI collaborator that derives summaries, visualizations, findings, recommendations, and drafts from a Mosque Organization's data. Its outputs remain proposals until a responsible person confirms any resulting action.
_Avoid_: Autonomous administrator, chatbot

**AI Command Center**:
The default Moskent workspace, combining permission-aware information widgets, visual findings, priorities, and access to the Moskent Copilot. Conversation supports the workspace but does not dominate it.
_Avoid_: Chat page, static dashboard, app catalog

**Person**:
An individual recorded in a Mosque Organization's shared directory, whether or not they can sign in to Moskent.
_Avoid_: User, account, contact

**User Account**:
The sign-in identity through which a Person may receive access to one or more Mosque Organizations.
_Avoid_: Person, member

**Organization Administrator**:
A verified User Account entrusted with organization-wide governance of a Mosque Organization. The role is shared by at least two people and conveys no permanent personal ownership of the organization.
_Avoid_: Owner, super admin, founding owner

**Team**:
An organizational unit within a Mosque Organization that may have one parent Team and any number of child Teams, forming an unrestricted hierarchy. A Team's position does not itself grant access to its descendants.
_Avoid_: Department, workspace, fixed-level subteam

**Role Template**:
A reusable set of permissions defined by a Mosque Organization for assignment within its Team hierarchy. A Team may also define a specialized Role Template for local needs.
_Avoid_: User type, job title

**Role Assignment**:
The grant of a Role Template to a User Account for either one Team or that Team and its descendants.
_Avoid_: Team position, membership

**Audience**:
A manually maintained or rule-based collection of Persons used for filtering, insights, and targeted communication. Inclusion in an Audience grants no access or Team workspace.
_Avoid_: Group, Team, role

**Responsible Adult Link**:
A typed relationship connecting a child Person to an adult Person for defined contact or safeguarding purposes, such as parent, legal guardian, caregiver, or emergency contact. The relationship does not itself grant platform access.
_Avoid_: Guardian account, household membership, access permission

**Access Grant**:
An explicit, verified permission allowing a responsible adult to access specified information or actions concerning a child through a future community-facing experience.
_Avoid_: Responsible Adult Link, assumed parental access

**Access Register**:
A restricted record of physical access items and responsibility for protected resources, including custody, reviews, and revocation history. It may reference an external secrets manager but never contains raw digital credentials or application secrets.
_Avoid_: Password vault, secrets store

**Meeting**:
An internal collaboration session with participants, an agenda, notes, decisions, and resulting Tasks.
_Avoid_: Event, appointment

**Event**:
A scheduled program delivered by organizers to an Audience, potentially involving attendance, registration, communication, and promotional material.
_Avoid_: Meeting, Task

**Task**:
A trackable piece of work that may stand alone or result from a Meeting or Event.
_Avoid_: Decision, agenda item
