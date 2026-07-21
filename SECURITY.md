# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in Azure Policy Lens, please **do not** open a public GitHub issue. Instead, please:

1. Email security details to the maintainers privately
2. Include a description of the vulnerability
3. Include steps to reproduce (if applicable)
4. Include potential impact assessment

We will respond to security reports within 48 hours and work to publish a fix as quickly as possible.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |

## Security Best Practices

When deploying Azure Policy Lens:

1. **Always use HTTPS** — Enable SSL/TLS encryption
2. **Keep dependencies updated** — Run `npm audit` regularly
3. **Use Azure AD/Passwordless** — For authentication
4. **Restrict database access** — Use Azure SQL firewall rules
5. **Enable audit logging** — Track sensitive operations
6. **Use managed identities** — For Azure resource authentication
7. **Rotate secrets** — Change API keys and credentials regularly
8. **Monitor logs** — Set up Application Insights alerts

## Compliance

This project follows security best practices for:
- OWASP Top 10
- Microsoft Cloud Security Benchmark
- Cyber Essentials framework

---

Thank you for helping keep Azure Policy Lens secure! 🔒
