import { NoticesCategoriesNav } from '../../components/NoticesCategoriesNav/NoticesCategoriesNav';
import { NoticesCategoriesList } from '../../components/NoticesCategoriesList/NoticesCategoriesList';
import { NoticesSearch } from '../../components/NoticesSearch/NoticesSearch';
import css from './NoticesPage.module.css';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoading, selectError } from '../../redux/notices/selectors';

import { getNoticesByCategories, getNoticesByTitle, getAllSelectedNotices, getAllOwnNotices } from "../../redux/notices/operations";

import { passTokenToHeadersAxios } from '../../utilities/helpers';
import { Loader } from '../../components/Loader/Loader';

const NoticesPage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);


  passTokenToHeadersAxios();

  const [searchQuery, setSearchQuery] = useState('');


  const [searchParams, setSearchParams] = useSearchParams();
  let { pathname } = useLocation();
  let category = pathname.split('/').pop();

   useEffect(() => {
     const queryFromSearchParams = searchParams.get('query');

    if (!category) {
      return;
    }
    if (category === 'favorite'){
      if(!queryFromSearchParams){
        dispatch(getAllSelectedNotices());
        return;
      }

    }
    if (category === 'own'){
        dispatch(getAllOwnNotices());
        return;

    }
    if (category === 'sell') {
      if (!queryFromSearchParams) {
        dispatch(getNoticesByCategories(category));

      return;
    }
   dispatch(getNoticesByTitle({category, queryFromSearchParams})); 
   return; 

    }
    if (category === 'lost-found') {
      if (!queryFromSearchParams) {
        dispatch(getNoticesByCategories(category));
        return;
      }

        dispatch(getNoticesByTitle({category, queryFromSearchParams}));
        return;

    }
    if (category === 'for-free') {
      if (!queryFromSearchParams) {
        dispatch(getNoticesByCategories(category));
        return;
      }
      dispatch(getNoticesByTitle({ category, queryFromSearchParams }));
    }

   dispatch(getNoticesByTitle({category, queryFromSearchParams}));
   return;
    } 

  }, [category, dispatch, searchParams]);

  const handleQueryChange = e => {
    const query = e.target.value;
    setSearchQuery(e.target.value.toLowerCase());
    const nextParams = query !== '' ? { query } : {};
    setSearchParams(nextParams);
  };

  const onClickClear = e => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      return toast.warn('Insert correct request');
    }

    e.target.reset();
    setSearchQuery('');
    setSearchParams('');
  };

  // if (category === 'favorite' && (searchQuery)) {
  //   if (selectedNotices.length === 0) {
  //     setSelectedNotices('');
  //     return toast.error('Nothing found for your request!');
  //    }
  //   const findNotices = selectedNotices.filter(item => item.title.includes(searchQuery));
  //   if (findNotices.length === 0) {
  //     setSelectedNotices('');
  //     return toast.error('Nothing found for your request!');
  //    }
  //    setSelectedNotices(findNotices);
  // }
  // if (category !== 'favorite' && (searchQuery)){
  //   getNoticesByTitle(searchQuery)
  //         .then(data => {
  //           if (data.length === 0) {
  //             setNotices('');
  //             return toast.error('Nothing found for your request!');
  //            }
  //           const findNotices = data.filter(item => item.category === category);
  //           if (findNotices.length === 0) {
  //             setNotices('');
  //             return toast.error('Nothing found for your request!');
  //           }
  //           setNotices(findNotices);
  //         })
  //         .catch(error => {
  //           console.log('Error', error);
  //         });
  // }

  // useEffect(() => {
  //   const queryFromSearchParams = searchParams.get('query');
  //   if (!category) {
  //     return;
  //   }

  //   if (category === 'favorite' && isLogged) {
  //     const findNotices = selectedNotices.filter(item => item.title.includes(queryFromSearchParams));
  // //    console.log('findNotices', findNotices);

  //     if (findNotices.length === 0) {
  //       return toast.error('Nothing found for your request!');
  //     }
  //     setSelectedNotices(findNotices);
  //   }

  //   if (category !== 'favorite') {

  //     getNoticesByCategories(category)
  //       .then(data => {
  //         setNotices(data);
  //       })
  //       .catch(error => {
  //         console.log('Error', error);
  //       });
  //   }
  // }, [category, searchParams, selectedNotices, isLogged]);

  return (
    <div className={css.container}>
      <h2 className={css.title}>Find your favorite pet</h2>
      <NoticesSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSubmit={onClickClear}
        onChange={handleQueryChange}
      />

      <NoticesCategoriesNav />

      {isLoading && !error && <Loader />}

      {error &&
        toast.error(
          `Oops, something went wrong! Reload the page or try again later!`
        )}

      <NoticesCategoriesList />
    </div>
  );
};

export default NoticesPage;
