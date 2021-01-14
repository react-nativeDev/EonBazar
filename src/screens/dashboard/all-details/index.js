import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import Header from '../../../common/header';
import {Block, CustomButton, ImageComponent, Text} from '../../../components';
import {addToCartRequest, getAllProductsRequest} from '../../../redux/action';
import ActivityLoader from '../../../components/activityLoader';
import {light} from '../../../components/theme/colors';
import {
  strictValidArray,
  strictValidObjectWithKeys,
} from '../../../utils/commonUtils';
import {config} from '../../../utils/config';

const initialState = {
  data: [],
};
const SeeAllDetails = () => {
  const dispatch = useDispatch();
  const nav = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setloader] = useState(false);
  const [state, setstate] = useState(initialState);
  const productsData = useSelector((v) => v.category.productList.data);
  const isLoad = useSelector((v) => v.category.productList.loading);
  const userProfile = useSelector((v) => v.user.profile.user);
  const quote_id = useSelector((v) => v.cart.cartId.id);
  const currency = useSelector(
    (v) => v.currency.currencyDetail.data.base_currency_code,
  );
  const {data} = state;

  const LoadRandomData = async () => {
    if (!isLoad) {
      const res = await dispatch(
        getAllProductsRequest({
          currentPage,
          pageSize: 10,
        }),
      );
      if (res) {
        setloader(true);
      }
    }
  };
  useEffect(() => {
    const newData = [];
    productsData &&
      productsData.map((a) => {
        const special_price = a.custom_attributes.find(
          (v) => v.attribute_code === 'special_price',
        );
        newData.push({
          qty: 1,
          name: a.name,
          image: a.media_gallery_entries[0].file,
          currency_code: currency || 'BDT',
          price_info: a.price,
          specialPrice: special_price
            ? Math.ceil(special_price.value).toFixed(2)
            : a.price,
          isLoad: false,
          sku: a.sku,
        });
      });
    setstate({...state, data: data.concat(newData)});
  }, [productsData]);
  const LoadMoreRandomData = async () => {
    if (data.length <= 59) {
      await setCurrentPage(currentPage + 1);
      LoadRandomData();
    }
  };

  // useEffect(() => {

  //   setData(newData);
  // }, [data]);

  const addToCart = async (val, index) => {
    if (strictValidObjectWithKeys(userProfile)) {
      const old = data[index];
      const updated = {...old, isLoad: true};
      const clone = [...data];
      clone[index] = updated;
      setstate({data: clone});
      const newData = {
        sku: val.sku,
        qty: val.qty,
        quote_id: quote_id,
      };
      await dispatch(addToCartRequest(newData));
    } else {
      Alert.alert('Error', 'Please login First');
    }
  };

  const updateQty = (qty, index) => {
    const old = data[index];
    const updated = {...old, qty: qty};
    const clone = [...data];
    clone[index] = updated;
    setstate({data: clone});
  };

  const renderFooter = () => {
    if (data.length >= 60) {
      return null;
    }
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!isLoad) {
      return null;
    } else {
      return (
        <Block alignSelf="center">
          <ActivityIndicator size="large" color={light.secondary} />
        </Block>
      );
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <Block
        style={{width: wp(45), minHeight: hp(35)}}
        padding={[hp(2)]}
        margin={[hp(0.5), wp(1.8)]}
        primary
        flex={false}>
        <Icon name="ios-heart-outline" size={15} />
        <Icon name="ios-shuffle" size={15} />
        <CustomButton
          activeOpacity={1}
          onPress={() =>
            nav.navigate('Details', {
              item: item,
            })
          }
          margin={[hp(1), 0, 0, 0]}
          center
          flex={false}>
          <ImageComponent name={`${config.Image_Url}${item.image}`} isURL />
          <Text size={12} center margin={[hp(2), 0, 0, 0]} body>
            {item.name}
          </Text>
          <Text size={12} body margin={[hp(1), 0, 0, 0]} semibold>
            {item.currency_code} {item.specialPrice}
          </Text>
          {item.price_info !== item.specialPrice && (
            <LineAboveText
              body
              size={12}
              color="grey"
              margin={[hp(0.2), 0, 0, 0]}>
              {item.currency_code} {item.price_info}
            </LineAboveText>
          )}
        </CustomButton>
        <Block
          margin={[hp(1), 0, 0, 0]}
          center
          row
          space={'between'}
          flex={false}>
          <Block
            style={{width: wp(18)}}
            center
            row
            space={'between'}
            borderWidth={1}
            borderRadius={10}
            padding={[hp(0.5)]}
            borderColorDeafult
            flex={false}>
            <TouchableOpacity
              disabled={item.qty === 1}
              onPress={() => updateQty(item.qty - 1, index)}>
              <Icon name="ios-remove-outline" size={15} />
            </TouchableOpacity>

            <Text size={12}>{item.qty}</Text>
            <Icon
              onPress={() => updateQty(item.qty + 1, index)}
              name="add"
              size={15}
            />
          </Block>
          <CustomButton
            onPress={() => addToCart(item, index)}
            secondary
            padding={[hp(1)]}
            borderRadius={20}
            center
            middle
            flex={false}>
            {item.isLoad ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcon name="shopping-bag" size={20} color="#fff" />
            )}
          </CustomButton>
        </Block>
      </Block>
    );
  };
  return (
    <Block>
      {!loader && isLoad && <ActivityLoader />}
      <Header leftIcon={false} />
      <FlatList
        contentContainerStyle={flatlistContentStyle}
        data={strictValidArray(data) && data.slice(0, 60)}
        renderItem={renderItem}
        onEndReached={LoadMoreRandomData}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
      />
    </Block>
  );
};
const LineAboveText = styled(Text)({
  textDecorationLine: 'line-through',
  textDecorationStyle: 'solid',
});
const flatlistContentStyle = {
  flexWrap: 'wrap',
  flexDirection: 'row',
  paddingTop: hp(2),
  paddingBottom: hp(4),
  flexGrow: 1,
  justifyContent: 'center',
};

export default SeeAllDetails;
