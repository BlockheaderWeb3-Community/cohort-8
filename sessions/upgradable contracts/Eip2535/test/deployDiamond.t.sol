// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../contracts/interfaces/IDiamondCut.sol";
import "../contracts/facets/DiamondCutFacet.sol";
import "../contracts/facets/DiamondLoupeFacet.sol";
import "../contracts/facets/OwnershipFacet.sol";
import "../contracts/facets/IncreaseCount.sol";
import "../contracts/facets/Count.sol";
import "../contracts/libraries/LibAppDiamond.sol";
import "forge-std/Test.sol";
import "../contracts/Diamond.sol";

contract DiamondDeployer is Test, IDiamondCut {
    //contract types of facets to be deployed
    Diamond diamond;
    DiamondCutFacet dCutFacet;
    DiamondLoupeFacet dLoupe;
    OwnershipFacet ownerF;
    IncreaseCount incCount;
    Count countF;

    function setUp() public {
        //deploy facets
        dCutFacet = new DiamondCutFacet();
        diamond = new Diamond(address(this), address(dCutFacet));
        dLoupe = new DiamondLoupeFacet();
        ownerF = new OwnershipFacet();

        //upgrade diamond with facets

        //build cut struct
        FacetCut[] memory cut = new FacetCut[](2);

        cut[0] =
        (FacetCut({
                facetAddress: address(dLoupe),
                action: FacetCutAction.Add,
                functionSelectors: generateSelectors("DiamondLoupeFacet")
            }));

        cut[1] =
        (FacetCut({
                facetAddress: address(ownerF),
                action: FacetCutAction.Add,
                functionSelectors: generateSelectors("OwnershipFacet")
            }));

        //upgrade diamond
        IDiamondCut(address(diamond)).diamondCut(cut, address(0x0), "");

        //call a function
        DiamondLoupeFacet(address(diamond)).facetAddresses();
    }

    function testInDiamondLoupeFacetcreaseCount() public {
        //deploy IncreaseCount facet
        incCount = new IncreaseCount();
        countF = new Count();

        //build cut struct
        FacetCut[] memory cut = new FacetCut[](2);

        cut[0] =
        (FacetCut({
                facetAddress: address(incCount),
                action: FacetCutAction.Add,
                functionSelectors: generateSelectors("IncreaseCount")
            }));
       

        //upgrade diamond
        IDiamondCut(address(diamond)).diamondCut(cut, address(0x0), "");

        FacetCut[] memory cut1 = new FacetCut[](1);
        cut1[0] =
        (FacetCut({
                facetAddress: address(countF),
                action: FacetCutAction.Replace,
                functionSelectors: generateSelectors("IncreaseCount")
            }));

        //upgrade diamond
        IDiamondCut(address(diamond)).diamondCut(cut1, address(0x0), "");

        //call increaseCount function
        IncreaseCount(address(diamond)).increaseCount(5);

        //check if count was increased
        uint256 count = IncreaseCount(address(diamond)).getCount();

        assertEq(count, 5);
    }

    function generateSelectors(string memory _facetName) internal returns (bytes4[] memory selectors) {
        string[] memory cmd = new string[](3);
        cmd[0] = "node";
        cmd[1] = "scripts/genSelectors.js";
        cmd[2] = _facetName;
        bytes memory res = vm.ffi(cmd);
        selectors = abi.decode(res, (bytes4[]));
    }

    function diamondCut(FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external override {}
}
