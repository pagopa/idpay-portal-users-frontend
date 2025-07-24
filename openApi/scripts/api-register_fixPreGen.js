// eslint-disable-next-line
import regexReplace from 'regex-replace';

regexReplace(
  '"items": \\{\\},',
  '"items":{"type": "object"},',
  'openApi/generated/register-swagger20.json',
  {
    fileContentsOnly: true,
  }
);

regexReplace(
  '"rewardRule": \\{\\},',
  '"rewardRule":{"type": "object"},',
  'openApi/generated/register-swagger20.json',
  {
    fileContentsOnly: true,
  }
);

regexReplace(
  '"operationId": "returns-fixed-automated-criteria",',
  '"operationId":"returnsFixedAutomatedCriteria",',
  'openApi/generated/register-swagger20.json',
  {
    fileContentsOnly: true,
  }
);
