type PayloadData = {
  initiativeId: string;
  confirmedTos: boolean;
  pdndAccept: boolean;
  iseeValue: string;
  selfDeclarationAccepted: boolean;
  userMail: string;
  userMailConfirmation: string;
};

const bonusDecoderPayload = (data: PayloadData) => ({
  initiativeId: data.initiativeId,
  confirmedTos: data.confirmedTos,
  pdndAccept: data.pdndAccept,
  selfDeclarationList: [],
  userMail: data.userMail,
  userMailConfirmation: data.userMailConfirmation
});

const bonusElettrodomesticiPayload = (data: PayloadData) => ({
  initiativeId: data.initiativeId,
  confirmedTos: data.confirmedTos,
  pdndAccept: data.pdndAccept,
  selfDeclarationList: [
    {
      _type: 'multi_consent' as const,
      code: 'isee',
      value: data.iseeValue === '3' ? '2' : data.iseeValue,
    },
    {
      _type: 'boolean' as const,
      code: '1',
      accepted: data.selfDeclarationAccepted,
    },
  ],
  userMail: data.userMail,
  userMailConfirmation: data.userMailConfirmation
});

const payloadByInitiative = {
  bonusdecoder: bonusDecoderPayload,
  bonuselettrodomestici: bonusElettrodomesticiPayload,
};

export const buildInitiativePayload = (
  initiative: string,
  data: PayloadData
) => {
  const payloadBuilder = payloadByInitiative[
    initiative.toLocaleLowerCase() as keyof typeof payloadByInitiative
  ] ?? bonusDecoderPayload; // default payload

  return payloadBuilder(data);
};