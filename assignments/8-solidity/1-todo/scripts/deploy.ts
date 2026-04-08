const { execSync } = require('child_process');

try {
  execSync(
    'npx hardhat ignition deploy ignition/modules/Todo.ts --network sepolia',
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}
