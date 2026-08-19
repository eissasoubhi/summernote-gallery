# Security Policy

## Supported versions

Security fixes are applied to the latest maintained major version. Older branches may receive a fix when the change is low risk, but they are not guaranteed to be supported.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting for this repository when available. Do not disclose exploitable details in a public issue before a fix is available.

Include the affected version, a minimal reproduction, the impact, and any suggested mitigation you have identified.

## Security model

Summernote Gallery inserts user-selected image URLs and HTML into a WYSIWYG editing surface. Applications remain responsible for validating remote data and sanitizing persisted/rendered editor HTML according to their threat model. Do not treat editor-side validation as a server-side security boundary.
