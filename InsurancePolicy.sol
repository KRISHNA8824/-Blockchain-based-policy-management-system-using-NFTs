// SPDX-License-Identifier: MIT

// OpenZeppelin Contracts v4.4.1 (utils/Counters.sol)
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract InsurancePolicy is
    Context,
    AccessControlEnumerable,
    ERC721Enumerable,
    ERC721Burnable
{
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    Counters.Counter private _tokenIdTracker;

    using Strings for uint256;

    // Policy terms and conditions
    struct Policy {
        string name;
        uint256 premiums;
        uint256 deductibles;
        uint256 coverageLimit;
        uint256 coveragePeriod;
        uint256 totalPremiumPaid;
        string termsAndConditions;
        bool approved;
        bool active;
        address policyHolder;
    }

    // Policyholder information
    struct PolicyHolder {
        string name;
        string Address;
        string contactInformation;
    }

    // Claim Information 
    struct ClaimInfo {
        uint256 amount;
        bool isSubmitted;
        bool approved; // approved or not
        bool status; // paid or not
    }

    // Mapping to store policies
    mapping(uint256 => Policy) public policies;
    
    // Mapping to store policy holders
    mapping(uint256 => PolicyHolder) public policyHolders;

    // Mapping to store claims info
    mapping(uint256 => ClaimInfo) public claimInfos;
    
    
    constructor(
        string memory name,
        string memory symbol
        
    ) ERC721(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(BURNER_ROLE, _msgSender());
    }

    // Mint an NFT to create a new policy
    function mint(address _policyHolder, uint256 _premiums, uint256 _deductibles, uint256 _coverageLimit, uint256 _coveragePeriod, string memory _policyName, string memory _termsAndConditions, string memory _policyHolderName, string memory _Address, string memory _contactInformation) public virtual {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have minter role to mint");

        _mint(_policyHolder, _tokenIdTracker.current());
        
        Policy storage policy = policies[_tokenIdTracker.current()];
        policy.premiums = _premiums;
        policy.deductibles = _deductibles;
        policy.coverageLimit = _coverageLimit;
        policy.coveragePeriod = _coveragePeriod;
        policy.totalPremiumPaid += _premiums;
        policy.name = _policyName;
        policy.termsAndConditions = _termsAndConditions;
        policy.policyHolder = _policyHolder;
        policy.active = true;
        policy.approved = true;

        PolicyHolder storage policyHolder = policyHolders[_tokenIdTracker.current()];
        policyHolder.name = _policyHolderName;
        policyHolder.Address = _Address;
        policyHolder.contactInformation = _contactInformation;

        ClaimInfo storage claimInfo = claimInfos[_tokenIdTracker.current()];
        claimInfo.isSubmitted = false;
        claimInfo.approved = false;
        claimInfo.status = false;

        _tokenIdTracker.increment();
    }

    // Get all Information of a policy
    function getInfo1(uint256 tokenId) public view virtual returns (uint256, uint256, uint256, uint256, uint256, string memory, string memory, string memory, string memory, string memory) {
        _requireMinted(tokenId);
        Policy storage policy = policies[tokenId];
        PolicyHolder storage policyHolder = policyHolders[tokenId];
        return (policy.premiums, policy.deductibles, policy.coverageLimit, policy.coveragePeriod, policy.totalPremiumPaid, policy.name, policy.termsAndConditions, policyHolder.name, policyHolder.Address, policyHolder.contactInformation);
    }

    // Get info2
    function getInfo2(uint256 tokenId) public view virtual returns (bool, bool, bool, bool, bool) {
        _requireMinted(tokenId);
        Policy storage policy = policies[tokenId];
        ClaimInfo storage claimInfo = claimInfos[tokenId];

        return (policy.approved, policy.active, claimInfo.isSubmitted, claimInfo.approved, claimInfo.status);
    }

    // Method to approve a policy
    function approvePolicy(uint256 tokenId) public {
        Policy storage policy = policies[tokenId];
        
        require(!policy.approved, "Policy already approved");
        
        policy.approved = true;
        
    }

    // Method to activate a policy
    function activatePolicy(uint256 tokenId) public {
        Policy storage policy = policies[tokenId];
        
        require(policy.approved && !policy.active, "Policy not approved or already active");
        
        policy.active = true;
        
    }

    // Method to submit a claim
    function submitClaim(uint256 tokenId) public {
        Policy storage policy = policies[tokenId];
        ClaimInfo storage claimInfo = claimInfos[tokenId];
        
        require(policy.active, "Policy not active");
        require(claimInfo.isSubmitted==false, "A claim is already submitted.");

        claimInfo.isSubmitted = true;
        
    }

    // Method to approve a claim
    function approveClaim(uint256 tokenId) public {
        Policy storage policy = policies[tokenId];
        ClaimInfo storage claimInfo = claimInfos[tokenId];
        
        require(policy.active, "Policy not active");
        require(claimInfo.isSubmitted==true, "There is no claim submission to approve.");
        require(claimInfo.approved==false, "A claim is already approved.");
        
        // Check if claim amount is within policy coverage
        // require(_claimAmount <= (policy.premiums - policy.deductibles), "Claim amount exceeds policy coverage");
        
        claimInfo.approved = true;

        // Payout the claim amount
        // uint256 payoutAmount = _claimAmount - policy.deductibles;
        //payable(policy.policyHolder).transfer(payoutAmount);

        claimInfo.status = true; // Claim is paid to policyholder
    }


    // Method to reject a claim
    function rejectClaim(uint256 tokenId) public {
        Policy storage policy = policies[tokenId];
        ClaimInfo storage claimInfo = claimInfos[tokenId];
        
        require(policy.active, "Policy not active");
        require(claimInfo.isSubmitted==true, "There is no claim submission to reject.");

        claimInfo.isSubmitted = false;
        
    }

    
    // Method to renew a policy
    function renewPolicy(uint256 tokenId, uint256 _premium) public {
        Policy storage policy = policies[tokenId];
        
        require(policy.active, "Policy not active");
        require(_premium == policy.premiums, "Incorrect premium amount");
        
        policy.totalPremiumPaid += _premium;
        
        // Check if the policy has expired and needs to be renewed
        uint256 currentTime = block.timestamp;
        uint256 policyExpirationTime = policy.coveragePeriod + currentTime;
        
        if (policyExpirationTime < currentTime) {
            policy.active = false;
            policy.approved = false;
        }
        
    }
    
   
    function burn(uint256 tokenId) public virtual override( ERC721Burnable){
        require(hasRole(BURNER_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have burner role to burn");
        _burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
