import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useGetState } from "../web3/useGetState";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useExecuteProposal } from "../web3/ExecuteProposal";
import { useExecuteProposalsendtoken } from "../web3/ExecuteProposal";
import { useGetproposaltype } from "../web3/useGetState";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const ExecuteProposal = ({ lastId, signer, value, description }) => {
  const { getProposalState } = useGetState();
  const { getProposaltype } = useGetproposaltype();

  const [proposalState, setProposalState] = useState(null);
  const [proposaltype, setProposaltype] = useState(null);

  const { queueProposal, executeProposal } = useExecuteProposal();

  const getTheState = async () => {
    const state = await getProposalState(lastId);
    setProposalState(state);
  };
  const getThetype = async () => {
    const type = await getProposaltype();
    setProposaltype(type);
  };

  useEffect(() => {
    getTheState();
  }, [proposalState]);
  useEffect(() => {
    getThetype();
  }, [proposaltype]);

  const handleVotingState = (e) => {
    const status = {
      0: "Pending",
      1: "Active",
      2: "Canceled",
      3: "Defeated",
      4: "Succeeded",
      5: "Queued",
      6: "Expired",
      7: "Executed",
    };
    return status[e] ?? "Unknown";
  };

  const shortId = lastId ? lastId.slice(0, 11) + "..." : 0;

  return (
    <>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Current/Latest Voting
        </Typography>
        <Typography variant="h5" component="div">
          {shortId}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          The Proposal state is {handleVotingState(proposalState)}
        </Typography>
      </CardContent>
      {handleVotingState(proposalState) === "Succeeded" ? (
        <div>
          <CardActions sx={{ justifyContent: "center", display: "flex" }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                queueProposal(signer, value, description);
              }}
            >
              Queue
            </Button>
          </CardActions>
        </div>
      ) : handleVotingState(proposalState) === "Queued" ? (
        <div>
          <CardActions sx={{ justifyContent: "center", display: "flex" }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                executeProposal(signer, value, description);
              }}
            >
              Execute
            </Button>
          </CardActions>
        </div>
      ) : handleVotingState(proposalState) === "Active" ? (
        <div> Voting Process Still active </div>
      ) : handleVotingState(proposalState) === "Defeated" ? (
        <div> The Proposal has failed wait until a new one</div>
      ) : (
        <div> You cant' execute now!</div>
      )}
    </>
  );
};

// signer, proposalId, support, reason
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const ExecuteProposalsendtoken = ({
  lastId,
  signer,
  value,
  description,
  address,
}) => {
  const { getProposalState } = useGetState();

  const [proposalState, setProposalState] = useState(null);

  const { queueProposal, executeProposal } = useExecuteProposalsendtoken();

  const getTheState = async () => {
    const state = await getProposalState(lastId);
    setProposalState(state);
  };

  useEffect(() => {
    getTheState();
  }, [proposalState]);

  const handleVotingState = (e) => {
    const status = {
      0: "Pending",
      1: "Active",
      2: "Canceled",
      3: "Defeated",
      4: "Succeeded",
      5: "Queued",
      6: "Expired",
      7: "Executed",
    };
    return status[e] ?? "Unknown";
  };

  const shortId = lastId ? lastId.slice(0, 11) + "..." : 0;

  return (
    <>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Execute Mint Token task
        </Typography>
        <Typography variant="h5" component="div">
          {shortId}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          The Proposal state is {handleVotingState(proposalState)}
        </Typography>
      </CardContent>
      {handleVotingState(proposalState) === "Succeeded" ? (
        <div>
          <CardActions sx={{ justifyContent: "center", display: "flex" }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                queueProposal(signer, value, description, address);
              }}
            >
              Queue
            </Button>
          </CardActions>
        </div>
      ) : handleVotingState(proposalState) === "Queued" ? (
        <div>
          <CardActions sx={{ justifyContent: "center", display: "flex" }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                executeProposal(signer, value, description, address);
              }}
            >
              Execute
            </Button>
          </CardActions>
        </div>
      ) : handleVotingState(proposalState) === "Active" ? (
        <div> Voting Process Still active </div>
      ) : handleVotingState(proposalState) === "Defeated" ? (
        <div> The Proposal has failed wait until a new one</div>
      ) : (
        <div> You cant' execute now!</div>
      )}
    </>
  );
};

// signer, proposalId, support, reason
