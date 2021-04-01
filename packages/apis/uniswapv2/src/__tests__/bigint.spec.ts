import { BigInt } from "../utils/BigInt";

describe("BigInt: Sanity", () => {

  it("Construct big numbers", () => {

    // constructor with small integer
    const smallStr = "100";
    const bigIntSmallStrCon = new BigInt(smallStr);
    expect(bigIntSmallStrCon.toString()).toStrictEqual(smallStr);
    // using fromString static method
    const bigIntSmallStrFrom = BigInt.fromString(smallStr);
    expect(bigIntSmallStrFrom.toString()).toStrictEqual(smallStr);

    // construct with big integer
    const bigStr = "10000000000000000000000000000000000000000000000000000000000000000000";
    const bigIntBigStr = new BigInt(bigStr);
    expect(bigIntBigStr.toString()).toStrictEqual(bigStr);
    expect(bigIntBigStr.isNegative).toStrictEqual(false);

    // construct with negative big integer
    const bigStrNeg = "-10000000000000000000000000000000000000000000000000000000000000000000";
    const bigIntBigStrNeg = new BigInt(bigStrNeg);
    expect(bigIntBigStrNeg.toString()).toStrictEqual(bigStrNeg);
    expect(bigIntBigStrNeg.isNegative).toStrictEqual(true);

    // construct with big integer from digits
    const bigDig = [1000, 1000, 1000];
    const bigIntBigDig = BigInt.fromDigits(bigDig);
    expect(bigIntBigDig.toString()).toStrictEqual("1000000001000000001000");
    expect(bigIntBigDig.isNegative).toStrictEqual(false);
    // construct with negative big integer from digits
    const bigIntBigDigNeg = BigInt.fromDigits(bigDig, true);
    expect(bigIntBigDigNeg.toString()).toStrictEqual("-1000000001000000001000");
    expect(bigIntBigDigNeg.isNegative).toStrictEqual(true);

  });


  it("Comparison", () => {

    // equals
    const intA = "100000000000000000000000000000000000000000000000000";
    const intB = "100000000000000000000000000000000000000000000000000";
    const biA = BigInt.fromString(intA);
    const biB = BigInt.fromString(intB);
    expect(biA.eq(biB)).toStrictEqual(true);
    expect(biA.lt(biB)).toStrictEqual(false);
    expect(biA.lte(biB)).toStrictEqual(true);
    expect(biA.gt(biB)).toStrictEqual(false);
    expect(biA.gte(biB)).toStrictEqual(true);

    // less than, greater than
    const intC = "100000000000000000000000000000000000000000000000000";
    const intD = "10000000000000000000000000000000000000000000000000";
    const biC = BigInt.fromString(intC);
    const biD = BigInt.fromString(intD);
    // greater compared to lesser
    expect(biC.eq(biD)).toStrictEqual(false);
    expect(biC.lt(biD)).toStrictEqual(false);
    expect(biC.lte(biD)).toStrictEqual(false);
    expect(biC.gt(biD)).toStrictEqual(true);
    expect(biC.gte(biD)).toStrictEqual(true);
    // lesser compared to greater
    expect(biD.lt(biC)).toStrictEqual(true);
    expect(biD.lte(biC)).toStrictEqual(true);
    expect(biD.gt(biC)).toStrictEqual(false);
    expect(biD.gte(biC)).toStrictEqual(false);

  });


  it("Addition", () => {

    // small integer addition
    const intA = "100";
    const intB = "50";
    const biA = BigInt.fromString(intA);
    const biB = BigInt.fromString(intB);
    expect(biA.add(biB).toString()).toStrictEqual("150");

    // big integer addition
    const intC = "1000000000000000000000000000000000000000000000000000000000000000000";
    const intD = "0000000000000000005000000000000000000000000000000000000000000000000";
    const biC = BigInt.fromString(intC);
    const biD = BigInt.fromString(intD);
    expect(biC.add(biD).toString()).toStrictEqual("1000000000000000005000000000000000000000000000000000000000000000000");

    // addition with two negative numbers
    const intE = "-1000000000000000000000000000000000000000000000000000000000000000000";
    const intF = "-0000000000000000005000000000000000000000000000000000000000000000000";
    const biE = BigInt.fromString(intE);
    const biF = BigInt.fromString(intF);
    expect(biE.add(biF).toString()).toStrictEqual("-1000000000000000005000000000000000000000000000000000000000000000000");

    // addition with one negative number and one positive number
    const intG = "-1000000000000000005000000000000000000000000000000000000000000000000";
    const intH = "0000000000000000005000000000000000000000000000000000000000000000000";
    const biG = BigInt.fromString(intG);
    const biH = BigInt.fromString(intH);
    expect(biG.add(biH).toString()).toStrictEqual("-1000000000000000000000000000000000000000000000000000000000000000000");
  });


  it("Subtraction", () => {
    // big integer subtraction
    const intA = "1000000000000000005000000000000000000000000000000000000000000000000";
    const intB = "0000000000000000005000000000000000000000000000000000000000000000000";
    const biA = BigInt.fromString(intA);
    const biB = BigInt.fromString(intB);
    expect(biA.sub(biB).toString()).toStrictEqual("1000000000000000000000000000000000000000000000000000000000000000000");

    // subtraction of a bigger number from a smaller number and crossing zero to change signs
    const intC = "0000000000000000005000000000000000000000000000000000000000000000000";
    const intD = "1000000000000000005000000000000000000000000000000000000000000000000";
    const biC = BigInt.fromString(intC);
    const biD = BigInt.fromString(intD);
    expect(biC.sub(biD).toString()).toStrictEqual("-1000000000000000000000000000000000000000000000000000000000000000000");

    // subtraction with two negative numbers
    const intE = "-1000000000000000005000000000000000000000000000000000000000000000000";
    const intF = "-0000000000000000005000000000000000000000000000000000000000000000000";
    const biE = BigInt.fromString(intE);
    const biF = BigInt.fromString(intF);
    expect(biE.sub(biF).toString()).toStrictEqual("-1000000000000000000000000000000000000000000000000000000000000000000");

    // subtraction with one negative number and one positive number
    const intG = "-1000000000000000005000000000000000000000000000000000000000000000000";
    const intH = "0000000000000000005000000000000000000000000000000000000000000000000";
    const biG = BigInt.fromString(intG);
    const biH = BigInt.fromString(intH);
    expect(biG.sub(biH).toString()).toStrictEqual("-1000000000000000010000000000000000000000000000000000000000000000000");
    const intI = "1000000000000000005000000000000000000000000000000000000000000000000";
    const intJ = "-0000000000000000005000000000000000000000000000000000000000000000000";
    const biI = BigInt.fromString(intI);
    const biJ = BigInt.fromString(intJ);
    expect(biI.sub(biJ).toString()).toStrictEqual("1000000000000000010000000000000000000000000000000000000000000000000");
  });


  it("Multiplication", () => {
    // big integer multiplication
    const intA = "1748673246820348602804623476982897439256983468762846982060929060934";
    const intB = "1000000000000000000000000000000000000000000000000000000000000000000";
    const biA = BigInt.fromString(intA);
    const biB = BigInt.fromString(intB);
    expect(biA.mul(biB).toString()).toStrictEqual("1748673246820348602804623476982897439256983468762846982060929060934000000000000000000000000000000000000000000000000000000000000000000");

    // multiplication with two negative numbers
    const intE = "-78947029734601043986098348634860927985723987523875683269589";
    const intF = "-1000000000000000000000000000000000000000000000000000000000000000000";
    const biE = BigInt.fromString(intE);
    const biF = BigInt.fromString(intF);
    expect(biE.mul(biF).toString()).toStrictEqual("78947029734601043986098348634860927985723987523875683269589000000000000000000000000000000000000000000000000000000000000000000");

    // multiplication with opposite signs
    const intG = "-78947029734601043986098348634860927985723987523875683269589";
    const intH = "1000000000000000000000000000000000000000000000000000000000000000000";
    const biG = BigInt.fromString(intG);
    const biH = BigInt.fromString(intH);
    expect(biG.mul(biH).toString()).toStrictEqual("-78947029734601043986098348634860927985723987523875683269589000000000000000000000000000000000000000000000000000000000000000000");
  });


  it("Division", () => {
    // division by small integer
    const intA = "1748673246820348602804623476982897439256983468762846982060929060934";
    const intB = 1000
    const biA = BigInt.fromString(intA);
    expect(biA.divInt(intB).toString()).toStrictEqual("1748673246820348602804623476982897439256983468762846982060929060");

    // modulo small integer
    const intC = "1748673246820348602804623476982897439256983468762846982060929060934";
    const intD = 1000
    const biC = BigInt.fromString(intC);
    expect(biC.modInt(intD).toString()).toStrictEqual("934");

    // // division by big integer
    // const intE = "1748673246820348602804623476982897439256983468762846982060929060934";
    // const intF = "0000000000000000000000000001000000000000000000000000000000000000000"
    // const biE = BigInt.fromString(intE);
    // const biF = BigInt.fromString(intF);
    // expect(biE.div(biF).toString()).toStrictEqual("1748673246820348602804623476");
    //
    // const intG = "1748673246820348602804623476982897439256983468762846982060929060934";
    // const intH = "6235862358623856826358623875623587"
    // const biG = BigInt.fromString(intG);
    // const biH = BigInt.fromString(intH);
    // expect(biG.div(biH).toString()).toStrictEqual("280422040490042098934906652980388");

  });
});
