import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import styled from 'styled-components/native';
import Banner from '../../common/banner';
import Footer from '../../common/footer';
import Header from '../../common/header';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../components';
import Search from '../../components/search';
import {t1, t2, w2, w3} from '../../components/theme/fontsize';
import HeaderMenu from '../../common/headerMenu';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCartRequest,
  addToGuestCartRequest,
  filterCategoryListRequest,
} from '../../redux/action';
import {
  strictValidArray,
  strictValidObjectWithKeys,
} from '../../utils/commonUtils';
import {light} from '../../components/theme/colors';
import {useNavigation} from '@react-navigation/core';
import Icon from 'react-native-vector-icons/Ionicons';
import {config} from '../../utils/config';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const initialState = {
  data: [],
};
const Category = (props) => {
  const dispatch = useDispatch();
  const nav = useNavigation();

  const [scrollView, setScrollView] = useState(true);
  const [state, setstate] = useState(initialState);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setloader] = useState(false);
  const {data} = state;

  // Reducers Values
  const guestCartToken = useSelector((v) => v.cart.guestcartId.id);
  const userProfile = useSelector((v) => v.user.profile.user);
  const currency = useSelector(
    (v) => v.currency.currencyDetail.data.base_currency_code,
  );
  const saveFiltered = useSelector((v) => v.category.filterIds.id);
  const filteredData = useSelector((v) => v.category.filterList.data.items);
  const totalCount = useSelector((v) => v.category.filterList.data.total_count);
  const loading = useSelector((v) => v.category.filterList.loading);
  const category = useSelector(
    (v) => v.category.categoryList.data.children_data,
  );
  const quote_id = useSelector((v) => v.cart.cartId.id);

  // Render Menu

  const scrollRef = useRef();
  const [menu, setmenu] = useState(saveFiltered.id);
  const [name, setname] = useState(saveFiltered.name);

  const sortingMenu = (val) => {
    setmenu(val.id);
    setname(val.name);
  };

  useEffect(() => {
    dispatch(
      filterCategoryListRequest({
        currentPage,
        pageSize: 10,
        menu,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  useEffect(() => {
    if (!menu) {
      setmenu(category[0].id);
      setname(category[0].name);
    }
  }, [category]);

  const LoadRandomData = async () => {
    if (!loading) {
      const res = await dispatch(
        filterCategoryListRequest({
          currentPage,
          pageSize: 10,
          menu,
        }),
      );
      if (res) {
        setloader(true);
      }
    }
  };
  useEffect(() => {
    const newData = [];
    filteredData &&
      filteredData.map((a) => {
        const special_price = a.custom_attributes.find(
          (v) => v.attribute_code === 'special_price',
        );
        const getImage = a.media_gallery_entries.find(
          (image) => image.media_type === 'image',
        );
        newData.push({
          qty: 1,
          name: a.name,
          image: getImage && getImage.file,
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
  }, [filteredData]);
  console.log(filteredData, 'filteredData');

  const LoadMoreRandomData = async () => {
    if (data.length <= totalCount) {
      await setCurrentPage(currentPage + 1);
      LoadRandomData();
    }
  };

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
      const old = data[index];
      const updated = {...old, isLoad: true};
      const clone = [...data];
      clone[index] = updated;
      setstate({data: clone});
      const newData = {
        sku: val.sku,
        qty: val.qty,
        quote_id: guestCartToken,
      };
      await dispatch(
        addToGuestCartRequest({token: guestCartToken, items: newData}),
      );
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
    if (!loading) {
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
        style={{width: widthPercentageToDP(45), minHeight: hp(35)}}
        padding={[hp(2)]}
        margin={[hp(0.5), widthPercentageToDP(1.8)]}
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
          <Text
            numberOfLines={3}
            size={12}
            center
            margin={[hp(2), 0, 0, 0]}
            body>
            {item.name}
          </Text>
          <Text size={12} body margin={[hp(1), 0, 0, 0]} semibold>
            {item.currency_code} {item.price_info}
          </Text>
          {/* {item.price_info !== item.specialPrice && (
            <LineAboveText
              body
              size={12}
              color="grey"
              margin={[hp(0.2), 0, 0, 0]}>
              {item.currency_code} {item.price_info}
            </LineAboveText>
          )} */}
        </CustomButton>
        <Block
          margin={[hp(1), 0, 0, 0]}
          center
          row
          space={'between'}
          flex={false}>
          <Block
            style={{width: widthPercentageToDP(18)}}
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
    <Block
      onStartShouldSetResponderCapture={() => {
        setScrollView(true);
      }}>
      <Header />
      <Block flex={false} padding={[0, w3, 0, w3]}>
        <Search />
      </Block>
      <ScrollView
        ref={scrollRef}
        scrollEnabled={scrollView}
        showsVerticalScrollIndicator={false}>
        <HeaderMenu onPress={sortingMenu} color={menu} />
        <Banner />
        <Block
          center
          row
          space={'between'}
          margin={[0, w2, 0, w2]}
          flex={false}>
          <Text semibold size={15}>
            {name || ''}
          </Text>
          <ShopByButton color="secondary">Shop by</ShopByButton>
        </Block>
        <Block
          margin={[t2, w2, 0, w2]}
          borderWidth={0.5}
          primary
          row
          center
          space={'between'}
          flex={false}
          padding={[t1, w3]}>
          {filteredData && (
            <Text size={12}>{filteredData && filteredData.length} items</Text>
          )}
          <Block center flex={false} row>
            {/* <Text size={12}>sort by </Text>
            <RNPickerSelect
              placeholder={{
                label: 'position',
                value: '',
              }}
              useNativeAndroidPickerStyle={false}
              style={dropdownStyle}
              // value={values.type}
              // onValueChange={(value) => console.log(value)}
              mode="dropdown"
              items={[
                {label: 'test', value: 'low'},
                {label: 'test', value: 'medium'},
                {label: 'test', value: 'higher'},
              ]}
            /> */}
          </Block>
        </Block>
        {loading ? (
          <Block color="transparent" style={{height: hp(30)}} center middle>
            <ActivityIndicator color={light.secondary} size="large" />
          </Block>
        ) : (
          <View
            style={{flex: 1}}
            onStartShouldSetResponderCapture={() => {
              setScrollView(false);
              if (
                scrollRef &&
                scrollRef.current?.contentOffset === 0 &&
                scrollView === false
              ) {
                setScrollView(true);
              }
            }}>
            <FlatList
              contentContainerStyle={flatlistContentStyle}
              data={strictValidArray(data) && data}
              renderItem={renderItem}
              onEndReached={LoadMoreRandomData}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
              maxHeight={500}
            />
          </View>
        )}

        <Footer images={false} />
      </ScrollView>
    </Block>
  );
};
const ShopByButton = styled(Button)({
  marginVertical: 0,
  paddingVertical: hp(1),
  paddingHorizontal: widthPercentageToDP(2),
});
const dropdownStyle = {
  placeholder: {
    color: '#000000',
    fontSize: 10,
  },
  inputIOS: {
    paddingLeft: widthPercentageToDP(2),
    paddingRight: widthPercentageToDP(2),
    paddingVertical: hp(0.5),
    borderColor: '#000',
    color: '#000',
    borderWidth: 0.4,
    borderRadius: 5,
  },
  inputAndroid: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: hp(1),
    borderColor: '#323643',
    color: '#000',
    borderWidth: 0.6,
    borderRadius: 5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 16,
  },
  viewContainer: {
    // marginTop: hp(1),
  },
};
const flatlistContentStyle = {
  flexWrap: 'wrap',
  flexDirection: 'row',
  paddingTop: hp(2),
  paddingBottom: hp(4),
  flexGrow: 1,
  justifyContent: 'center',
};
export default Category;
