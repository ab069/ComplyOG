from typing import List, Dict, Any


def calculate_carbon_footprint(emissions: List[Dict]) -> Dict:
    total_co2 = sum(e.get("co2_tonnes", 0) for e in emissions)
    total_ch4 = sum(e.get("ch4_tonnes", 0) for e in emissions)
    total_n2o = sum(e.get("n2o_tonnes", 0) for e in emissions)
    by_source = {}
    for e in emissions:
        src = e.get("source_type", "unknown")
        by_source[src] = by_source.get(src, 0) + e.get("co2e_tonnes", 0)
    total_co2e = sum(e.get("co2e_tonnes", 0) for e in emissions)
    return {
        "total_co2e": round(total_co2e, 4),
        "breakdown": {
            "co2": round(total_co2, 4),
            "ch4": round(total_ch4, 4),
            "n2o": round(total_n2o, 4),
        },
        "by_source": {k: round(v, 4) for k, v in by_source.items()},
        "total_emissions": len(emissions),
    }


def check_regulation_status(regs: List[Dict], emissions_data: List[Dict]) -> Dict:
    total = len(regs)
    compliant = sum(1 for r in regs if r.get("status") == "compliant")
    non_compliant = sum(1 for r in regs if r.get("status") == "non_compliant")
    pending = sum(1 for r in regs if r.get("status") == "pending")
    compliance_rate = round((compliant / total * 100), 1) if total > 0 else 0.0
    flagged = []
    for r in regs:
        if r.get("status") == "non_compliant":
            flagged.append({
                "regulation": r.get("regulation_name"),
                "authority": r.get("authority"),
                "category": r.get("category"),
                "deadline": str(r.get("deadline")) if r.get("deadline") else None,
            })
    return {
        "total_regulations": total,
        "compliant": compliant,
        "non_compliant": non_compliant,
        "pending": pending,
        "compliance_rate": compliance_rate,
        "flagged_regulations": flagged,
        "total_emissions_tracked": len(emissions_data),
    }


def assess_esg_score(emissions_performance: Dict, compliance_rate: float, audit_results: List[Dict]) -> int:
    emission_score = 0
    total_co2e = emissions_performance.get("total_co2e", 0)
    if total_co2e < 100:
        emission_score = 40
    elif total_co2e < 500:
        emission_score = 30
    elif total_co2e < 1000:
        emission_score = 20
    else:
        emission_score = 10

    compliance_score = int(compliance_rate * 0.4)

    audit_scores = [a.get("score", 0) for a in audit_results if a.get("score", 0) > 0]
    avg_audit = sum(audit_scores) / len(audit_scores) if audit_scores else 0
    audit_score = int(avg_audit * 0.2)

    total = min(emission_score + compliance_score + audit_score, 100)
    return total


def identify_compliance_gaps(regulations: List[Dict], audit_findings: List[Dict]) -> List[Dict]:
    gaps = []
    for r in regulations:
        if r.get("status") == "non_compliant":
            gaps.append({
                "type": "regulation_gap",
                "regulation": r.get("regulation_name"),
                "authority": r.get("authority"),
                "requirement": r.get("requirement"),
                "severity": "high",
                "action": f"Address non-compliance with {r.get('regulation_name')}",
            })
    for finding in audit_findings:
        if isinstance(finding, dict) and finding.get("severity") in ("critical", "high"):
            gaps.append({
                "type": "audit_finding",
                "finding": finding.get("description", str(finding)),
                "severity": finding.get("severity", "medium"),
                "action": f"Remediate audit finding: {finding.get('description', '')}",
            })
    return gaps


def generate_compliance_report(facility: str, score: int, findings: List[Dict]) -> str:
    report = f"COMPLIANCE REPORT - {facility}\n"
    report += f"{'=' * 50}\n"
    report += f"ESG Score: {score}/100\n"
    if score >= 80:
        report += "Rating: Excellent\n"
    elif score >= 60:
        report += "Rating: Good\n"
    elif score >= 40:
        report += "Rating: Fair\n"
    else:
        report += "Rating: Poor\n"
    report += f"\nFindings & Recommended Actions:\n"
    report += "-" * 40 + "\n"
    if not findings:
        report += "No significant findings.\n"
    else:
        for f in findings:
            report += f"- [{f.get('severity', 'info').upper()}] {f.get('action', f.get('finding', str(f)))}\n"
    return report
