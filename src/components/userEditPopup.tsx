import { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Dialog, TextField } from '@mui/material';
import isEmail from 'validator/lib/isEmail';

import type { RootState, AppDispatch } from '../redux/store';
import { saveUser, setIsNewUser, setEditUser } from '../redux/usersSlice';
import { toggleEditOpoup } from '../redux/popupSlice';

import { UserProps } from '../redux/user.interface';
import { PopupActionButton } from './button.styled';
import { RootDiv, FormDiv, InfoDiv, SmallTextFiled, ButtonDiv, ErrorMessage } from './editPopUp.styled';

interface UserPopupProps {
  isUniqueEmail: (value: string, id: string) => UserProps | undefined;
  isNew?: boolean;
}

enum FildName {
  title = 'title',
  firstName = 'firstName',
  lastName = 'lastName',
  email = 'email',
  city = 'city',
  country = 'country',
  streetName = 'streetName',
  streetNumber = 'streetNumber',
}

export const UserEditPopup = ({ isUniqueEmail }: UserPopupProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const isOpenEditPopup = useSelector<RootState>((state) => state.popupStoe.isOpenEditPopup) as boolean;
  const isNewUser = useSelector<RootState>((state) => state.usersStore.isNewUser) as boolean;
  const user = useSelector<RootState>((state) => state.usersStore.editUser) as UserProps;

  const [title, setTitle] = useState(user?.name.title || '');
  const [firstName, setFirstName] = useState(user?.name.first || '');
  const [lastName, setLastName] = useState(user?.name.last || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.location.city || '');
  const [country, setCountry] = useState(user?.location.country || '');
  const [streetName, setStreetName] = useState(user?.location.street.name || '');
  const [streetNember, setStreetNumber] = useState(user?.location.street.number || '');

  const [error, setError] = useState<string>('');

  const close = () => {
    if (isNewUser) dispatch(setIsNewUser(false));
    dispatch(setEditUser(undefined));
    dispatch(toggleEditOpoup());
  };

  const checkInputs = () => {
    let isError = false;
    if (firstName.length < 3 || lastName.length < 3) {
      isError = true;
      setError('name should have at least 3 characters.');
    }

    if (!isEmail(email)) {
      isError = true;
      setError('Please set an email');
    }

    const isUnique = isUniqueEmail(email, user.login.uuid);
    if (isUnique) {
      isError = true;
      setError('This email allready exists');
    }

    return isError;
  };

  const onSave = () => {
    const isError = checkInputs();
    if (isError) return;

    let newUser: UserProps = {
      ...user,
      email,
      name: {
        title,
        first: firstName,
        last: lastName,
      },
      location: {
        city,
        country,
        street: {
          ...user.location,
          name: streetName,
          number: Number(streetNember),
        },
      },
    };

    dispatch(saveUser(newUser));
    dispatch(toggleEditOpoup());
  };

  const editField = (value: string, fieldName: FildName) => {
    if (error.length > 0) setError('');
    switch (fieldName) {
      case FildName.title:
        setTitle(value);
        break;
      case FildName.firstName:
        setFirstName(value);
        break;
      case FildName.lastName:
        setLastName(value);
        break;
      case FildName.email:
        setEmail(value);
        break;
      case FildName.city:
        setCity(value);
        break;
      case FildName.country:
        setCountry(value);
        break;
      case FildName.streetName:
        setStreetName(value);
        break;
      default:
        setStreetNumber(Number(value));
    }
  };

  return (
    <Dialog open={isOpenEditPopup} onClose={close}>
      <RootDiv>
        <Typography variant='h6'>Edit User</Typography>
        <FormDiv>
          <div>
            <Typography variant='body1'>Name:</Typography>
            <InfoDiv>
              <SmallTextFiled
                id='outlined-basic'
                label='Title'
                variant='outlined'
                value={title}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  editField(event.target.value, FildName.title);
                }}
                fullWidth={false}
              />
              <InfoDiv>
                <TextField
                  id='outlined-basic'
                  label='First name'
                  variant='outlined'
                  value={firstName}
                  onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    editField(event.target.value, FildName.firstName);
                  }}
                />
                <TextField
                  id='outlined-basic'
                  label='Last name'
                  variant='outlined'
                  value={lastName}
                  onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    editField(event.target.value, FildName.lastName);
                  }}
                />
              </InfoDiv>
            </InfoDiv>
          </div>

          <div>
            <Typography variant='body1'>email:</Typography>
            <InfoDiv>
              <TextField
                id='outlined-basic'
                variant='outlined'
                label='email'
                value={email}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  editField(event.target.value, FildName.email)
                }
              />
            </InfoDiv>
          </div>

          <div>
            <Typography variant='body1'>Adress:</Typography>
            <InfoDiv>
              <TextField
                id='outlined-basic'
                label='Country'
                variant='outlined'
                value={country}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  editField(event.target.value, FildName.country)
                }
              />
              <TextField
                id='outlined-basic'
                label='City'
                variant='outlined'
                value={city}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  editField(event.target.value, FildName.city)
                }
              />

              <TextField
                id='outlined-basic'
                label='Street'
                variant='outlined'
                value={streetName}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  editField(event.target.value, FildName.streetName)
                }
              />
              <SmallTextFiled
                id='outlined-basic'
                label='Number'
                variant='outlined'
                value={streetNember}
                onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  editField(event.target.value, FildName.streetNumber)
                }
              />
            </InfoDiv>
          </div>
        </FormDiv>
        {error ? <ErrorMessage variant='subtitle2'>{error}</ErrorMessage> : null}
        <ButtonDiv>
          <PopupActionButton onClick={onSave}>Save</PopupActionButton>
          <PopupActionButton onClick={close}>Cancel</PopupActionButton>
        </ButtonDiv>
      </RootDiv>
    </Dialog>
  );
};
