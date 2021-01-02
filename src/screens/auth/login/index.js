import React from 'react';
import {ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../../common/header';
import {Block, Button, CustomButton, Input, Text} from '../../../components';
import Search from '../../../components/search';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Footer from '../../../common/footer';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as yup from 'yup';
const Login = () => {
  const nav = useNavigation();

  const renderNavigations = () => {
    return (
      <Block padding={[hp(2), wp(7), hp(2), wp(7)]} flex={false}>
        <CustomButton margin={[hp(0.7), 0, 0, 0]} flex={false} row center>
          <Icon name="account" size={20} />
          <Text margin={[0, 0, 0, wp(1)]} transform="uppercase" body>
            My Account
          </Text>
        </CustomButton>
        <CustomButton
          onPress={() => nav.navigate('Wishlist')}
          margin={[hp(0.7), 0, 0, 0]}
          flex={false}
          row
          center>
          <Icon name="heart" size={20} />
          <Text margin={[0, 0, 0, wp(1)]} transform="uppercase" body>
            My Wishlist
          </Text>
        </CustomButton>
        <CustomButton
          onPress={() => nav.navigate('YourOrder')}
          margin={[hp(0.7), 0, 0, 0]}
          flex={false}
          row
          center>
          <Icon name="cart-outline" size={20} />
          <Text margin={[0, 0, 0, wp(1)]} transform="uppercase" body>
            My Order
          </Text>
        </CustomButton>
        <CustomButton
          onPress={() => nav.navigate('Help')}
          margin={[hp(0.7), 0, 0, 0]}
          flex={false}
          row
          center>
          <Icon name="account" size={20} />
          <Text margin={[0, 0, 0, wp(1)]} transform="uppercase" body>
            Contact us
          </Text>
        </CustomButton>
      </Block>
    );
  };
  const submitValues = (values) => {
    console.log(values, 'values');
  };
  return (
    <Block>
      <Formik
        initialValues={{mobile: '', password: ''}}
        onSubmit={submitValues}
        validationSchema={yup.object().shape({
          mobile: yup
            .string()
            .min(10)
            .max(15)
            .required('Mobile Number is Required'),
          password: yup.string().min(6).required('Password is Required'),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          handleSubmit,
          dirty,
        }) => (
          <>
            <Header />
            <Block flex={false} padding={[0, wp(3), hp(2), wp(3)]}>
              <Search />
            </Block>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text semibold transform="uppercase" center>
                Customer Login
              </Text>
              <Block
                padding={hp(2)}
                margin={[hp(2), wp(4), hp(2), wp(4)]}
                flex={false}
                primary>
                <Text transform="uppercase" body semibold center>
                  Registered Customers
                </Text>
                <Text margin={[hp(0.5), 0, 0, 0]} body center color="#636363">
                  if you have an account, sign in with your mobile number and
                  password
                </Text>

                <Input
                  keyboardType={'number-pad'}
                  label="Mobile Numer"
                  value={values.mobile}
                  onChangeText={handleChange('mobile')}
                  onBlur={() => setFieldTouched('mobile')}
                  error={touched.mobile && errors.mobile}
                  errorText={touched.mobile && errors.mobile}
                />
                <Text color="#636363" caption>
                  please add number without counry code.
                </Text>
                <Input
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => setFieldTouched('password')}
                  error={touched.password && errors.password}
                  errorText={touched.password && errors.password}
                  secure={true}
                />
                <Button
                  disabled={!dirty}
                  onPress={handleSubmit}
                  color="secondary">
                  SIGN IN
                </Button>
                <Text transform="uppercase" underline center caption>
                  Forgot your password?
                </Text>
              </Block>
              <Block
                margin={[hp(2), 0, 0, 0]}
                padding={[hp(2), wp(7), hp(2), wp(7)]}
                flex={false}
                primary>
                <Text transform="uppercase" center body>
                  New Customer?{' '}
                  <Text
                    onPress={() => nav.navigate('NewCustomer')}
                    secondary
                    center
                    body>
                    Start here
                  </Text>
                </Text>
              </Block>
              {renderNavigations()}
              <Footer images={false} />
            </ScrollView>
          </>
        )}
      </Formik>
    </Block>
  );
};

export default Login;
