

  // Convert ETH to GWEI (1 ETH = 1,000,000,000 GWEI)
  function ethToGwei(eth) {
    return eth * 1e9;
  }

  function calculateGas() {
    const gasUsed = Number(document.getElementById("gasUsed").value);
    let baseFee = Number(document.getElementById("baseFee").value);
    let priorityFee = Number(document.getElementById("priorityFee").value);
    let maxFee = Number(document.getElementById("maxFee").value);

    if (baseFee < 1 && baseFee > 0) baseFee = ethToGwei(baseFee);
    if (priorityFee < 1 && priorityFee > 0) priorityFee = ethToGwei(priorityFee);
    if (maxFee < 1 && maxFee > 0) maxFee = ethToGwei(maxFee);

    const result = estimateGasFee(
      gasUsed,
      baseFee,
      priorityFee,
      maxFee
    );

    alert(
      "Effective Gas Price: " +
        result.effectiveGasPriceGwei +
        " Gwei\n" +
        "Total Gas Fee: " +
        result.totalGasFeeEth +
        " ETH"
    );
  }

  function estimateGasFee(
    gasUsed,
    baseFeeGwei,
    priorityFeeGwei,
    maxFeeGwei
  ) {
    const effectiveGasPriceGwei = Math.min(
      baseFeeGwei + priorityFeeGwei,
      maxFeeGwei
    );

    const totalFeeGwei = gasUsed * effectiveGasPriceGwei;
    const totalGasFeeEth = totalFeeGwei / 1000000000;

    return {
      effectiveGasPriceGwei,
      totalGasFeeEth
    };
  }

