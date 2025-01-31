<!--
   IMPORTANT: Add appropriate labels BEFORE you save the merge request. CI/CD jobs
   can be skipped only if the labels are applied BEFORE the CI/CD pipeline is created.
   See https://docs.gitlab.com/ee/development/pipelines#revert-mrs for more info.
-->

## Purpose of revert

<!-- Please link to the relevant incident -->

### Checklist

- [ ] Create an issue to reinstate the merge request and assign it to the author of the reverted merge request.
- [ ] If the revert is to resolve a [broken 'master' incident](https://about.gitlab.com/handbook/engineering/workflow/#broken-master), please read through the [Responsibilities of the Broken `master` resolution DRI](https://about.gitlab.com/handbook/engineering/workflow/#responsibilities-of-the-resolution-dri).
- [ ] Add the appropriate labels **before** the MR is created. We can skip CI/CD jobs only if the labels are added **before** the CI/CD pipeline is created.

### Milestone info

- [ ] I am reverting something in the **current** milestone. No changelog is needed, and I've added a `~"regression:*"` label.
- [ ] I am reverting something in a **different** milestone. A changelog is needed, and I've removed the `~"regression:*"` label.

### Related issues and merge requests


/label ~"pipeline:expedite" ~"master:broken"

<!--
   Regression label: if applicable, specify the milestone-specific regression label
   (such as ~regression:15.8) to skip additional CI/CD jobs, like Danger changelog checks. -->

<!-- /label ~regression: -->
