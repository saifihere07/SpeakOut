import { create } from "zustand";
import { TFeedbackItem } from "../../lib/types";

type Store = {
  feedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  selectedCompany: string;
  getCompanyList: () => string[];
  getFilteredFeedbackItemList: () => TFeedbackItem[];
  addItemToList: (text: string) => Promise<void>;
  selectCompany: (company: string) => void;
  fetchFeedbackItems: () => Promise<void>;
};

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  //states of Store
  feedbackItems: [],
  isLoading: false,
  errorMessage: "",
  selectedCompany: "",
  getCompanyList: () => {
    return get()
      .feedbackItems.map((item) => item.company)
      .filter((company, index, array) => {
        return array.indexOf(company) === index;
      });
  },
  getFilteredFeedbackItemList: () => {
    const state = get();
    return state.selectedCompany
      ? state.feedbackItems.filter((feedbackItem) => {
          return feedbackItem.company === state.selectedCompany;
        })
      : state.feedbackItems;
  },
  //Actions
  addItemToList: async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);
    const newItem: TFeedbackItem = {
      text: text,
      id: new Date().getTime(),
      daysAgo: 0,
      upvoteCount: 0,
      company: companyName,
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
    };
    //   setFeedbackItems([...feedbackItems, newItem]);
    set((state) => ({
      feedbackItems: [...state.feedbackItems, newItem],
    }));
    await fetch(
      import.meta.env.VITE_API_URL,

      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },

  selectCompany: (company: string) => {
    // setSelectedCompany(company);
    set(() => ({
      selectedCompany: company,
    }));
  },

  fetchFeedbackItems: async () => {
    // setIsLoading(true);
    set(() => ({
      isLoading: true,
    }));
    try {
      const response = await fetch(import.meta.env.VITE_API_URL);
      if (!response.ok) {
        throw Error();
      }
      const data = await response.json();
      //   setFeedbackItems(data.feedbacks);
      set(() => ({
        feedbackItems: data.feedbacks,
      }));
    } catch (error) {
      //   setErrorMeassage("Something went wrong.");
      set(() => ({
        errorMessage: "Something went wrong.",
      }));
    }
    // setIsLoading(false);
    set(() => ({
      isLoading: false,
    }));
  },
}));
