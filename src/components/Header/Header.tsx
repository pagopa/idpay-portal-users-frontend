import { Header as CommonHeader } from '@pagopa/selfcare-common-frontend/lib';

type Props = {
  withSecondHeader: boolean;
  onExit: (exitAction: () => void) => void;
//   loggedUser?: User;
};

const Header = ({ withSecondHeader }: /* , parties */ Props) => {

  return (
    <CommonHeader
      onExit={() => {}}
      withSecondHeader={withSecondHeader}
      loggedUser={
        false
        // loggedUser
        //   ? {
        //       id: loggedUser ? loggedUser.uid : '',
        //       name: loggedUser?.name,
        //       surname: loggedUser?.surname,
        //       email: loggedUser?.email,
        //     }
        //   : false
      }
      enableLogin={false}
    />
  );
};
export default Header;