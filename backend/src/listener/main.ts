import * as ethers from 'ethers'; //V6
import abi from "../../abi.json";

//load ABI data containing the Swap event
const abiInterfaces = new ethers.Interface(abi);

async function main() {
    let params = `timestamp=gte:${unixFrom}&timestamp=lte:${unixTo}`;
    params += `&topic0=${abiInterface.getEvent('Swap')!.topicHash}`;

    const url = `${mirrorNodeBaseUrl}/api/v1/contracts/results/logs?${params}`;
    const response = await axios.get(url);
    const logs = response.data.logs;

    //group logs on transaction hash
    const groupedLogs: any = {};
    for (const log of logs) {
        const tnxHash = log.transaction_hash;
        if (!groupedLogs[tnxHash]) {
            groupedLogs[tnxHash] = [];
        }
        groupedLogs[tnxHash].push(log);
    }

    Object.keys(groupedLogs).forEach(tnxHash => {
        console.log(`\nTransaction hash: ${tnxHash}`);
        for (const log of groupedLogs[tnxHash]) {
            const pairEvmAddress = log.address; //use this to get token0 and token1 data

            const parsedLog = abiInterfaces.parseLog({ topics: log.topics.slice(), data: log.data });
            const result = parsedLog!.args;

            let output = '';
            output += `Pair: ${pairEvmAddress}`;
            output += `, timestamp: ${log.timestamp}`;
            output += `, amountIn: ${result.amount0}`;
            output += `, amountOut: ${result.amount1}`;
            output += `, sqrtPriceX96: ${result.sqrtPriceX96}`;
            output += `, liquidity: ${result.liquidity}`;
            output += `, tick: ${result.tick}`;

            console.log(output);
        }
    });
}