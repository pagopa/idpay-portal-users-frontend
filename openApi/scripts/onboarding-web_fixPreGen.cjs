const regexReplace = require('regex-replace');

regexReplace(
  '"OperationDTO": \\{\\},',
  '"OperationDTO":{"type": "object", "properties": { "operationId": {"type":"string"}, "operationType": {"type":"string"}, "operationDate": {"type":"string"}, "amountCents": {"type":"number"}, "accruedCents": {"type":"number"}, "brand": {"type":"string"}, "idTrxIssuer": {"type":"string"}, "idTrxAcquirer":{"type":"string"}, "brandLogo": {"type":"string"}, "maskedPan": {"type":"string"}, "channel": {"type":"string"}, "iban": {"type":"string"}, "eventId": {"type": "string"}, "status": {"type": "string"}, "businessName": {"type": "string"}, "instrumentType": {"type": "string"}}, "required": ["operationId","operationType","operationDate"]},',
  'openApi/generated/onboarding-web-swagger20.json',
  {
    fileContentsOnly: true,
  }
);

regexReplace(
  '"OperationListDTO": \\{',
  '"OperationListDTO":{"type": "object", "items": {"$ref": "#/definitions/OperationListDTO"},',
  'openApi/generated/onboarding-web-swagger20.json',
  {
    fileContentsOnly: true,
  }
);

regexReplace(
  '"SelfConsentDTO": \\{',
  '"SelfConsentDTO":{"type": "object", "items": {"$ref": "#/definitions/SelfConsentDTO"},',
  'openApi/generated/onboarding-web-swagger20.json',
  {
    fileContentsOnly: true,
  }
);

regexReplace(
  '"SelfDeclarationDTO": \\{',
  '"SelfDeclarationDTO":{"type": "object", "items": {"$ref": "#/definitions/SelfDeclarationDTO"},',
  'openApi/generated/onboarding-web-swagger20.json',
  {
    fileContentsOnly: true,
  }
);
