import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { Typography, Avatar } from '@mui/material';

import type { AppDispatch } from '../redux/store';

import { UserProps } from '../redux/user.interface';
import { UserCardActionButton } from './button.styled';
import { COLORS } from '../utils/const';
import { openPopup } from '../redux/popupSlice';
import { setEditUser } from '../redux/usersSlice';
import { deleteUser } from '../redux/usersSlice';

const RootDiv = styled.div`
  border-radius: 5px;
  border: 1px solid ${COLORS.GREY};
  padding: 10px 20px;
  color: ${COLORS.GREY};
  width: 380px;
  @media (max-width: 600px) {
    width: 320px;
    padding: 10px 15px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UserName = styled(Typography)`
  margin-bottom: 10px;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const Body = styled(Typography)`
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const AdressDiv = styled.div`
  margin-top: 5px;
`;

interface UserCardProps {
  user: UserProps;
}

export const UserCard = ({ user }: UserCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const onEdit = () => {
    dispatch(setEditUser(user));
    dispatch(openPopup());
  };

  return (
    <RootDiv>
      <UserInfo>
        <div>
          <UserName variant='h6'>{`${user.name.title} ${user.name.first} ${user.name.last}`}</UserName>

          <Body variant='body1'>email: {user.email}</Body>
          <AdressDiv>
            <Body variant='body1'>country: {user.location.country}</Body>
            <Body variant='body1'>city: {user.location.city}</Body>
            <Body variant='body1'>
              street: {user.location.street.name}, {user.location.street.number}
            </Body>
          </AdressDiv>
        </div>
        <div>
          <Avatar alt={`${user.name.first} ${user.name.last}`} src={user.picture.medium} />
        </div>
      </UserInfo>
      <ButtonDiv>
        <UserCardActionButton onClick={onEdit}>Edit</UserCardActionButton>
        <UserCardActionButton onClick={() => dispatch(deleteUser(user.login.uuid))}>delete</UserCardActionButton>
      </ButtonDiv>
    </RootDiv>
  );
};
