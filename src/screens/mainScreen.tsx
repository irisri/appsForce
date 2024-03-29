import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Container, Box, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import type { RootState, AppDispatch } from '../redux/store';
import { setUsers, setIsNewUser, setEditUser } from '../redux/usersSlice';
import { toggleEditOpoup } from '../redux/popupSlice';
import { UserProps } from '../redux/user.interface';

import { URL } from '../utils/const';

import { UserCard } from '../components/userCard';
import { UserEditPopup } from '../components/userEditPopup';
import { ConfirmationPopup } from '../components/confirmPopup';
import { PopupActionButton } from '../components/button.styled';

const RootBox = styled(Box)`
  margin-top: 50px;
`;

const Title = styled(Typography)`
  margin-bottom: 50px;
  text-align: center;
  @media (max-width: 900px) {
    margin-bottom: 30px;
  }
`;

const AddUserBox = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  @media (max-width: 900px) {
    justify-content: center;
    margin-bottom: 30px;
  }
`;

const UserBox = styled(Box)`
  margin-bottom: 50px;
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
  justify-content: space-between;
  @media (max-width: 900px) {
    justify-content: center;
    gap: 20px;
  }
`;

const newUserTemplate: UserProps = {
  name: {
    first: '',
    title: '',
    last: '',
  },
  email: '',
  location: {
    street: {
      number: 0,
      name: '',
    },
    city: '',
    country: '',
  },
  picture: {
    large: '',
    medium: '',
    thumbnail: '',
  },
  login: {
    uuid: '',
  },
};

export const MainScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const users = useSelector<RootState>((state) => state.usersStore.users) as UserProps[];
  const userEdit = useSelector<RootState>((state) => state.usersStore.editUser) as UserProps;

  useEffect(() => {
    if (users && users.length > 0) return;

    const getData = async () => {
      const res = await fetch(URL);
      const date = await res.json();

      dispatch(setUsers(date.results));
    };

    getData();
  }, [users, dispatch]);

  const isUniqueEmail = (email: string, id: string): UserProps | undefined => {
    return users.find((user) => {
      if (user.email === email && user.login.uuid) return undefined;
      return user.email === email;
    });
  };

  const addNewUser = () => {
    let newUser = {
      ...newUserTemplate,
      login: {
        uuid: uuidv4(),
      },
    };

    dispatch(setIsNewUser(true));

    dispatch(setEditUser(newUser));
    dispatch(toggleEditOpoup());
  };

  return (
    <Container maxWidth='md'>
      {userEdit ? <UserEditPopup isUniqueEmail={isUniqueEmail} /> : null}
      <ConfirmationPopup />
      <RootBox>
        <Title variant='h3'>User list</Title>
        <AddUserBox>
          <PopupActionButton onClick={addNewUser}>Add user</PopupActionButton>
        </AddUserBox>
        <UserBox>
          {users.length > 0 ? users.map((user) => <UserCard key={user.login.uuid} user={user} />) : null}
        </UserBox>
      </RootBox>
    </Container>
  );
};
