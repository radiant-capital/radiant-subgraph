import { NewTransferAdded as NewTransferAddedEvent } from "../generated/MFDstats/MFDstats";
import { NewTransferAdded } from "../generated/schema";
import { loadAsset } from "./entities/asset";
import { loadUsdTransfered } from "./entities/usdTransfer";
import { getHistoryEntityId } from "./utils";

export function handleNewTransferAdded(event: NewTransferAddedEvent): void {
  let asset = loadAsset(event.params.asset);
  let usdTransfered = loadUsdTransfered();
  usdTransfered.totalUsdTransfered = usdTransfered.totalUsdTransfered.plus(event.params.usdValue);
  usdTransfered.totalLpUsdTransfered = usdTransfered.totalLpUsdTransfered.plus(event.params.lpUsdValue);
  usdTransfered.save();

  let entity = new NewTransferAdded(getHistoryEntityId(event));
  entity.txHash = event.transaction.hash;
  entity.action = "NewTransferAdded";
  entity.asset = asset.id;
  entity.timestamp = event.block.timestamp.toI32();

  entity.usdValue = event.params.usdValue;
  entity.lpUsdValue = event.params.lpUsdValue;

  entity.save();
}