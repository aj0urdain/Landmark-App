export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      app_config: {
        Row: {
          description: string | null;
          key: string;
          value: Json;
        };
        Insert: {
          description?: string | null;
          key: string;
          value: Json;
        };
        Update: {
          description?: string | null;
          key?: string;
          value?: Json;
        };
        Relationships: [];
      };
      article_comment_reactions: {
        Row: {
          comment_id: string | null;
          created_at: string;
          id: number;
          react_type: string | null;
          user_id: string | null;
        };
        Insert: {
          comment_id?: string | null;
          created_at?: string;
          id?: number;
          react_type?: string | null;
          user_id?: string | null;
        };
        Update: {
          comment_id?: string | null;
          created_at?: string;
          id?: number;
          react_type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'article_comment_reactions_comment_id_fkey';
            columns: ['comment_id'];
            isOneToOne: false;
            referencedRelation: 'article_comments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_comment_reactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_comment_reactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      article_comments: {
        Row: {
          article_id: number;
          comment: string;
          created_at: string | null;
          created_by: string | null;
          deleted: boolean;
          edit_history: Json | null;
          id: string;
          parent_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          article_id: number;
          comment: string;
          created_at?: string | null;
          created_by?: string | null;
          deleted?: boolean;
          edit_history?: Json | null;
          id?: string;
          parent_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          article_id?: number;
          comment?: string;
          created_at?: string | null;
          created_by?: string | null;
          deleted?: boolean;
          edit_history?: Json | null;
          id?: string;
          parent_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'article_comments_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_comments_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_comments_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_comments_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'article_comments';
            referencedColumns: ['id'];
          },
        ];
      };
      article_reactions: {
        Row: {
          article_id: number | null;
          created_at: string | null;
          id: number;
          react_type: string;
          user_id: string;
        };
        Insert: {
          article_id?: number | null;
          created_at?: string | null;
          id?: number;
          react_type: string;
          user_id: string;
        };
        Update: {
          article_id?: number | null;
          created_at?: string | null;
          id?: number;
          react_type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'article_reactions_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_reactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_reactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      article_views: {
        Row: {
          article_id: number | null;
          created_at: string;
          first_viewed_at: string;
          id: number;
          last_viewed_at: string;
          user_id: string | null;
          view_count: number | null;
        };
        Insert: {
          article_id?: number | null;
          created_at?: string;
          first_viewed_at?: string;
          id?: number;
          last_viewed_at?: string;
          user_id?: string | null;
          view_count?: number | null;
        };
        Update: {
          article_id?: number | null;
          created_at?: string;
          first_viewed_at?: string;
          id?: number;
          last_viewed_at?: string;
          user_id?: string | null;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'article_views_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_views_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'article_views_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      articles: {
        Row: {
          article_type: string | null;
          author_id: string | null;
          author_id_secondary: string | null;
          author_id_tertiary: string | null;
          authorisation: boolean;
          content: Json | null;
          cover_image: string | null;
          created_at: string | null;
          departments: number[] | null;
          description: string | null;
          featured: boolean | null;
          id: number;
          public: boolean;
          title: string | null;
          updated_at: string | null;
          viewer_ids: string[] | null;
          views: number | null;
        };
        Insert: {
          article_type?: string | null;
          author_id?: string | null;
          author_id_secondary?: string | null;
          author_id_tertiary?: string | null;
          authorisation?: boolean;
          content?: Json | null;
          cover_image?: string | null;
          created_at?: string | null;
          departments?: number[] | null;
          description?: string | null;
          featured?: boolean | null;
          id?: number;
          public?: boolean;
          title?: string | null;
          updated_at?: string | null;
          viewer_ids?: string[] | null;
          views?: number | null;
        };
        Update: {
          article_type?: string | null;
          author_id?: string | null;
          author_id_secondary?: string | null;
          author_id_tertiary?: string | null;
          authorisation?: boolean;
          content?: Json | null;
          cover_image?: string | null;
          created_at?: string | null;
          departments?: number[] | null;
          description?: string | null;
          featured?: boolean | null;
          id?: number;
          public?: boolean;
          title?: string | null;
          updated_at?: string | null;
          viewer_ids?: string[] | null;
          views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'articles_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'articles_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'articles_author_id_secondary_fkey';
            columns: ['author_id_secondary'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'articles_author_id_secondary_fkey';
            columns: ['author_id_secondary'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'articles_author_id_tertiary_fkey';
            columns: ['author_id_tertiary'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'articles_author_id_tertiary_fkey';
            columns: ['author_id_tertiary'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      auction_locations: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      auction_results: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          file_path: string | null;
          id: number;
          is_active: boolean | null;
          locations: string | null;
          portfolio_id: number | null;
          title: string | null;
          version: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          file_path?: string | null;
          id?: number;
          is_active?: boolean | null;
          locations?: string | null;
          portfolio_id?: number | null;
          title?: string | null;
          version?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          file_path?: string | null;
          id?: number;
          is_active?: boolean | null;
          locations?: string | null;
          portfolio_id?: number | null;
          title?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'auction_results_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'auction_results_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'auction_results_portfolio_id_fkey';
            columns: ['portfolio_id'];
            isOneToOne: false;
            referencedRelation: 'portfolios';
            referencedColumns: ['id'];
          },
        ];
      };
      auction_venues: {
        Row: {
          created_at: string;
          id: number;
          image: string | null;
          location_id: number | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          image?: string | null;
          location_id?: number | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          image?: string | null;
          location_id?: number | null;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'auction_venues_location_id_fkey';
            columns: ['location_id'];
            isOneToOne: false;
            referencedRelation: 'auction_locations';
            referencedColumns: ['id'];
          },
        ];
      };
      auctions: {
        Row: {
          created_at: string;
          end_date: string | null;
          id: number;
          location_id: number | null;
          portfolio_id: number | null;
          start_date: string | null;
          venue_id: number | null;
        };
        Insert: {
          created_at?: string;
          end_date?: string | null;
          id?: number;
          location_id?: number | null;
          portfolio_id?: number | null;
          start_date?: string | null;
          venue_id?: number | null;
        };
        Update: {
          created_at?: string;
          end_date?: string | null;
          id?: number;
          location_id?: number | null;
          portfolio_id?: number | null;
          start_date?: string | null;
          venue_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'auctions_location_id_fkey';
            columns: ['location_id'];
            isOneToOne: false;
            referencedRelation: 'auction_locations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'auctions_portfolio_id_fkey';
            columns: ['portfolio_id'];
            isOneToOne: false;
            referencedRelation: 'portfolios';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'auctions_venue_id_fkey';
            columns: ['venue_id'];
            isOneToOne: false;
            referencedRelation: 'auction_venues';
            referencedColumns: ['id'];
          },
        ];
      };
      audit_log: {
        Row: {
          action: string;
          action_details: string | null;
          created_at: string | null;
          id: string;
          task_id: string | null;
          updated_by: string | null;
        };
        Insert: {
          action: string;
          action_details?: string | null;
          created_at?: string | null;
          id?: string;
          task_id?: string | null;
          updated_by?: string | null;
        };
        Update: {
          action?: string;
          action_details?: string | null;
          created_at?: string | null;
          id?: string;
          task_id?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'audit_log_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      branches: {
        Row: {
          branch_name: string;
          contact_number: string | null;
          country_id: number | null;
          description: string | null;
          headline: string | null;
          id: number;
          level_number: string | null;
          state_id: number | null;
          street_id: number | null;
          street_number: string | null;
          suburb_id: number | null;
          suite_number: string | null;
        };
        Insert: {
          branch_name: string;
          contact_number?: string | null;
          country_id?: number | null;
          description?: string | null;
          headline?: string | null;
          id?: number;
          level_number?: string | null;
          state_id?: number | null;
          street_id?: number | null;
          street_number?: string | null;
          suburb_id?: number | null;
          suite_number?: string | null;
        };
        Update: {
          branch_name?: string;
          contact_number?: string | null;
          country_id?: number | null;
          description?: string | null;
          headline?: string | null;
          id?: number;
          level_number?: string | null;
          state_id?: number | null;
          street_id?: number | null;
          street_number?: string | null;
          suburb_id?: number | null;
          suite_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'branches_country_id_fkey';
            columns: ['country_id'];
            isOneToOne: false;
            referencedRelation: 'countries';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'branches_state_id_fkey';
            columns: ['state_id'];
            isOneToOne: false;
            referencedRelation: 'states';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'branches_street_id_fkey';
            columns: ['street_id'];
            isOneToOne: false;
            referencedRelation: 'streets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'branches_suburb_id_fkey';
            columns: ['suburb_id'];
            isOneToOne: false;
            referencedRelation: 'suburbs';
            referencedColumns: ['id'];
          },
        ];
      };
      chat_messages: {
        Row: {
          chat_room_id: number | null;
          content: string | null;
          created_at: string;
          id: number;
          user_id: string;
        };
        Insert: {
          chat_room_id?: number | null;
          content?: string | null;
          created_at?: string;
          id?: number;
          user_id?: string;
        };
        Update: {
          chat_room_id?: number | null;
          content?: string | null;
          created_at?: string;
          id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_messages_chat_room_id_fkey';
            columns: ['chat_room_id'];
            isOneToOne: false;
            referencedRelation: 'chat_rooms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_messages_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_messages_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      chat_rooms: {
        Row: {
          created_at: string;
          department_id: number | null;
          id: number;
          name: string | null;
          parent_room: number | null;
          team_id: number | null;
        };
        Insert: {
          created_at?: string;
          department_id?: number | null;
          id?: number;
          name?: string | null;
          parent_room?: number | null;
          team_id?: number | null;
        };
        Update: {
          created_at?: string;
          department_id?: number | null;
          id?: number;
          name?: string | null;
          parent_room?: number | null;
          team_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_rooms_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_rooms_parent_room_fkey';
            columns: ['parent_room'];
            isOneToOne: false;
            referencedRelation: 'chat_rooms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_rooms_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
        ];
      };
      countries: {
        Row: {
          country_name: string | null;
          created_at: string;
          id: number;
        };
        Insert: {
          country_name?: string | null;
          created_at?: string;
          id?: number;
        };
        Update: {
          country_name?: string | null;
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          department_name: string;
          description: string | null;
          id: number;
        };
        Insert: {
          department_name: string;
          description?: string | null;
          id?: number;
        };
        Update: {
          department_name?: string;
          description?: string | null;
          id?: number;
        };
        Relationships: [];
      };
      document_history: {
        Row: {
          change_summary: string | null;
          created_at: string | null;
          document_id: number | null;
          document_snapshot: Json | null;
          edited_by: string | null;
          id: number;
          status_id: number | null;
          version_number: number;
        };
        Insert: {
          change_summary?: string | null;
          created_at?: string | null;
          document_id?: number | null;
          document_snapshot?: Json | null;
          edited_by?: string | null;
          id?: number;
          status_id?: number | null;
          version_number: number;
        };
        Update: {
          change_summary?: string | null;
          created_at?: string | null;
          document_id?: number | null;
          document_snapshot?: Json | null;
          edited_by?: string | null;
          id?: number;
          status_id?: number | null;
          version_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'document_history_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'document_history_edited_by_fkey1';
            columns: ['edited_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'document_history_edited_by_fkey1';
            columns: ['edited_by'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'document_history_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: 'document_status';
            referencedColumns: ['id'];
          },
        ];
      };
      document_status: {
        Row: {
          id: number;
          status_description: string | null;
          status_name: string;
        };
        Insert: {
          id?: number;
          status_description?: string | null;
          status_name: string;
        };
        Update: {
          id?: number;
          status_description?: string | null;
          status_name?: string;
        };
        Relationships: [];
      };
      document_types: {
        Row: {
          id: number;
          type_description: string | null;
          type_name: string;
        };
        Insert: {
          id?: number;
          type_description?: string | null;
          type_name: string;
        };
        Update: {
          id?: number;
          type_description?: string | null;
          type_name?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          created_at: string | null;
          document_data: Json | null;
          document_owner: string | null;
          document_type_id: number | null;
          editors: string[] | null;
          id: number;
          listing_id: number | null;
          property_id: number | null;
          status_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          document_data?: Json | null;
          document_owner?: string | null;
          document_type_id?: number | null;
          editors?: string[] | null;
          id?: number;
          listing_id?: number | null;
          property_id?: number | null;
          status_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          document_data?: Json | null;
          document_owner?: string | null;
          document_type_id?: number | null;
          editors?: string[] | null;
          id?: number;
          listing_id?: number | null;
          property_id?: number | null;
          status_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_document_owner_fkey1';
            columns: ['document_owner'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_document_owner_fkey1';
            columns: ['document_owner'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_document_type_id_fkey';
            columns: ['document_type_id'];
            isOneToOne: false;
            referencedRelation: 'document_types';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_listing_id_fkey';
            columns: ['listing_id'];
            isOneToOne: false;
            referencedRelation: 'property_listings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_property_id_fkey';
            columns: ['property_id'];
            isOneToOne: false;
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_status_id_fkey';
            columns: ['status_id'];
            isOneToOne: false;
            referencedRelation: 'document_status';
            referencedColumns: ['id'];
          },
        ];
      };
      event_types: {
        Row: {
          created_at: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          name?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          created_at: string;
          event_entity_id: number;
          event_start_date: string | null;
          event_type: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          event_entity_id: number;
          event_start_date?: string | null;
          event_type: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          event_entity_id?: number;
          event_start_date?: string | null;
          event_type?: string;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'events_event_type_fkey';
            columns: ['event_type'];
            isOneToOne: false;
            referencedRelation: 'event_types';
            referencedColumns: ['name'];
          },
        ];
      };
      feedback_tickets: {
        Row: {
          created_at: string;
          description: string | null;
          feedback_type: string | null;
          id: number;
          page_url: string | null;
          status: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          feedback_type?: string | null;
          id?: number;
          page_url?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          feedback_type?: string | null;
          id?: number;
          page_url?: string | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'feedback_tickets_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'feedback_tickets_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      link_categories: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      links: {
        Row: {
          branches: number[] | null;
          category_id: number | null;
          created_at: string;
          created_by: string | null;
          departments: number[];
          description: string | null;
          id: number;
          teams: number[] | null;
          title: string;
          updated_at: string | null;
          url: string;
        };
        Insert: {
          branches?: number[] | null;
          category_id?: number | null;
          created_at?: string;
          created_by?: string | null;
          departments: number[];
          description?: string | null;
          id?: number;
          teams?: number[] | null;
          title: string;
          updated_at?: string | null;
          url: string;
        };
        Update: {
          branches?: number[] | null;
          category_id?: number | null;
          created_at?: string;
          created_by?: string | null;
          departments?: number[];
          description?: string | null;
          id?: number;
          teams?: number[] | null;
          title?: string;
          updated_at?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'links_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'link_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'links_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'links_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notes: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          entity_id: string;
          id: string;
          is_private: boolean | null;
          note: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          entity_id: string;
          id?: string;
          is_private?: boolean | null;
          note: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          entity_id?: string;
          id?: string;
          is_private?: boolean | null;
          note?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notes_created_by_fkey1';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notes_created_by_fkey1';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string | null;
          entity_id: string;
          entity_type: string | null;
          id: string;
          message: string | null;
          notification_assignee: string | null;
          priority: string | null;
          read: boolean | null;
        };
        Insert: {
          created_at?: string | null;
          entity_id: string;
          entity_type?: string | null;
          id?: string;
          message?: string | null;
          notification_assignee?: string | null;
          priority?: string | null;
          read?: boolean | null;
        };
        Update: {
          created_at?: string | null;
          entity_id?: string;
          entity_type?: string | null;
          id?: string;
          message?: string | null;
          notification_assignee?: string | null;
          priority?: string | null;
          read?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_notification_assignee_fkey1';
            columns: ['notification_assignee'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notifications_notification_assignee_fkey1';
            columns: ['notification_assignee'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      otp_attempts: {
        Row: {
          attempts: Json | null;
          created_at: string;
          user_id: string;
        };
        Insert: {
          attempts?: Json | null;
          created_at?: string;
          user_id: string;
        };
        Update: {
          attempts?: Json | null;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'otp_attempts_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'otp_attempts_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      portfolio_magazines: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          file_path: string | null;
          id: number;
          is_active: boolean | null;
          portfolio_id: number | null;
          stack_image_path: string | null;
          title: string | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          file_path?: string | null;
          id?: number;
          is_active?: boolean | null;
          portfolio_id?: number | null;
          stack_image_path?: string | null;
          title?: string | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          file_path?: string | null;
          id?: number;
          is_active?: boolean | null;
          portfolio_id?: number | null;
          stack_image_path?: string | null;
          title?: string | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'portfolio_magazines_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'portfolio_magazines_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'portfolio_magazines_portfolio_id_fkey';
            columns: ['portfolio_id'];
            isOneToOne: false;
            referencedRelation: 'portfolios';
            referencedColumns: ['id'];
          },
        ];
      };
      portfolio_results: {
        Row: {
          created_at: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      portfolios: {
        Row: {
          adelaide_advertiser: string | null;
          advertising_period_end: string | null;
          advertising_period_start: string | null;
          afr: string | null;
          bcm_natives: string | null;
          created_at: string;
          hsagesmh_w1: string | null;
          hsagesmh_w2: string | null;
          id: number;
          magazine_deadline: string | null;
          magazine_print: string | null;
          press_bookings: string | null;
          signed_schedule: string | null;
        };
        Insert: {
          adelaide_advertiser?: string | null;
          advertising_period_end?: string | null;
          advertising_period_start?: string | null;
          afr?: string | null;
          bcm_natives?: string | null;
          created_at?: string;
          hsagesmh_w1?: string | null;
          hsagesmh_w2?: string | null;
          id?: number;
          magazine_deadline?: string | null;
          magazine_print?: string | null;
          press_bookings?: string | null;
          signed_schedule?: string | null;
        };
        Update: {
          adelaide_advertiser?: string | null;
          advertising_period_end?: string | null;
          advertising_period_start?: string | null;
          afr?: string | null;
          bcm_natives?: string | null;
          created_at?: string;
          hsagesmh_w1?: string | null;
          hsagesmh_w2?: string | null;
          id?: number;
          magazine_deadline?: string | null;
          magazine_print?: string | null;
          press_bookings?: string | null;
          signed_schedule?: string | null;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          associated_agents: string[] | null;
          created_at: string | null;
          id: number;
          lead_agent: string | null;
          portfolios: number[] | null;
          property_type: string | null;
          salesforce_listing_id: string | null;
          salesforce_property_id: string | null;
          salesforce_submission_id: string | null;
          state_id: number | null;
          street_id: number | null;
          street_number: string | null;
          suburb_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          associated_agents?: string[] | null;
          created_at?: string | null;
          id?: number;
          lead_agent?: string | null;
          portfolios?: number[] | null;
          property_type?: string | null;
          salesforce_listing_id?: string | null;
          salesforce_property_id?: string | null;
          salesforce_submission_id?: string | null;
          state_id?: number | null;
          street_id?: number | null;
          street_number?: string | null;
          suburb_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          associated_agents?: string[] | null;
          created_at?: string | null;
          id?: number;
          lead_agent?: string | null;
          portfolios?: number[] | null;
          property_type?: string | null;
          salesforce_listing_id?: string | null;
          salesforce_property_id?: string | null;
          salesforce_submission_id?: string | null;
          state_id?: number | null;
          street_id?: number | null;
          street_number?: string | null;
          suburb_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'properties_lead_agent_fkey1';
            columns: ['lead_agent'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'properties_lead_agent_fkey1';
            columns: ['lead_agent'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_state_id_fkey';
            columns: ['state_id'];
            isOneToOne: false;
            referencedRelation: 'states';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_street_id_fkey';
            columns: ['street_id'];
            isOneToOne: false;
            referencedRelation: 'streets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_suburb_id_fkey';
            columns: ['suburb_id'];
            isOneToOne: false;
            referencedRelation: 'suburbs';
            referencedColumns: ['id'];
          },
        ];
      };
      property_listings: {
        Row: {
          associated_agents: string[] | null;
          created_at: string;
          id: number;
          lead_agent: string;
          portfolio: number | null;
          property_id: number | null;
          salesforce_listing_id: string | null;
        };
        Insert: {
          associated_agents?: string[] | null;
          created_at?: string;
          id?: number;
          lead_agent?: string;
          portfolio?: number | null;
          property_id?: number | null;
          salesforce_listing_id?: string | null;
        };
        Update: {
          associated_agents?: string[] | null;
          created_at?: string;
          id?: number;
          lead_agent?: string;
          portfolio?: number | null;
          property_id?: number | null;
          salesforce_listing_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'property_listing_lead_agent_fkey';
            columns: ['lead_agent'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_listing_lead_agent_fkey';
            columns: ['lead_agent'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_listing_portfolio_fkey';
            columns: ['portfolio'];
            isOneToOne: false;
            referencedRelation: 'portfolios';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'property_listing_property_id_fkey';
            columns: ['property_id'];
            isOneToOne: false;
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
        ];
      };
      recurring_tasks: {
        Row: {
          custom_interval: string | null;
          id: string;
          interval_type: string | null;
          next_occurrence: string | null;
          task_id: string | null;
        };
        Insert: {
          custom_interval?: string | null;
          id?: string;
          interval_type?: string | null;
          next_occurrence?: string | null;
          task_id?: string | null;
        };
        Update: {
          custom_interval?: string | null;
          id?: string;
          interval_type?: string | null;
          next_occurrence?: string | null;
          task_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'recurring_tasks_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      report_types: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          created_at: string;
          created_by: string | null;
          date_published: string | null;
          description: string | null;
          file_path: string | null;
          id: number;
          is_active: boolean | null;
          report_type: number | null;
          title: string | null;
          version: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          date_published?: string | null;
          description?: string | null;
          file_path?: string | null;
          id?: number;
          is_active?: boolean | null;
          report_type?: number | null;
          title?: string | null;
          version?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          date_published?: string | null;
          description?: string | null;
          file_path?: string | null;
          id?: number;
          is_active?: boolean | null;
          report_type?: number | null;
          title?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reports_report_type_fkey';
            columns: ['report_type'];
            isOneToOne: false;
            referencedRelation: 'report_types';
            referencedColumns: ['id'];
          },
        ];
      };
      roles: {
        Row: {
          id: number;
          role_name: string;
        };
        Insert: {
          id?: number;
          role_name: string;
        };
        Update: {
          id?: number;
          role_name?: string;
        };
        Relationships: [];
      };
      route_access: {
        Row: {
          created_at: string;
          department_id: number | null;
          id: string;
          role_id: number | null;
          route_id: string;
          team_id: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          department_id?: number | null;
          id?: string;
          role_id?: number | null;
          route_id: string;
          team_id?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          department_id?: number | null;
          id?: string;
          role_id?: number | null;
          route_id?: string;
          team_id?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'route_access_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'route_access_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'route_access_route_id_fkey';
            columns: ['route_id'];
            isOneToOne: false;
            referencedRelation: 'route_permissions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'route_access_route_id_fkey';
            columns: ['route_id'];
            isOneToOne: false;
            referencedRelation: 'route_permissions_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'route_access_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'route_access_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'route_access_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      route_permissions: {
        Row: {
          created_at: string;
          developing: boolean | null;
          icon: string | null;
          id: string;
          label: string;
          main_navigation: boolean;
          parent_path: string | null;
          path: string;
          public: boolean | null;
          sort_order: number | null;
        };
        Insert: {
          created_at?: string;
          developing?: boolean | null;
          icon?: string | null;
          id?: string;
          label: string;
          main_navigation?: boolean;
          parent_path?: string | null;
          path: string;
          public?: boolean | null;
          sort_order?: number | null;
        };
        Update: {
          created_at?: string;
          developing?: boolean | null;
          icon?: string | null;
          id?: string;
          label?: string;
          main_navigation?: boolean;
          parent_path?: string | null;
          path?: string;
          public?: boolean | null;
          sort_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'route_permissions_parent_path_fkey';
            columns: ['parent_path'];
            isOneToOne: false;
            referencedRelation: 'route_permissions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'route_permissions_parent_path_fkey';
            columns: ['parent_path'];
            isOneToOne: false;
            referencedRelation: 'route_permissions_complete';
            referencedColumns: ['id'];
          },
        ];
      };
      states: {
        Row: {
          country_id: number | null;
          id: number;
          short_name: string | null;
          state_name: string;
        };
        Insert: {
          country_id?: number | null;
          id?: number;
          short_name?: string | null;
          state_name: string;
        };
        Update: {
          country_id?: number | null;
          id?: number;
          short_name?: string | null;
          state_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'states_country_id_fkey';
            columns: ['country_id'];
            isOneToOne: false;
            referencedRelation: 'countries';
            referencedColumns: ['id'];
          },
        ];
      };
      streets: {
        Row: {
          id: number;
          state_id: number | null;
          street_name: string;
          suburb_id: number | null;
        };
        Insert: {
          id?: number;
          state_id?: number | null;
          street_name: string;
          suburb_id?: number | null;
        };
        Update: {
          id?: number;
          state_id?: number | null;
          street_name?: string;
          suburb_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'streets_state_id_fkey';
            columns: ['state_id'];
            isOneToOne: false;
            referencedRelation: 'states';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'streets_suburb_id_fkey';
            columns: ['suburb_id'];
            isOneToOne: false;
            referencedRelation: 'suburbs';
            referencedColumns: ['id'];
          },
        ];
      };
      suburbs: {
        Row: {
          id: number;
          postcode: string;
          state_id: number | null;
          suburb_name: string;
        };
        Insert: {
          id?: number;
          postcode: string;
          state_id?: number | null;
          suburb_name: string;
        };
        Update: {
          id?: number;
          postcode?: string;
          state_id?: number | null;
          suburb_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'suburbs_state_id_fkey';
            columns: ['state_id'];
            isOneToOne: false;
            referencedRelation: 'states';
            referencedColumns: ['id'];
          },
        ];
      };
      task_tag_relationship: {
        Row: {
          tag_id: string;
          task_id: string;
        };
        Insert: {
          tag_id: string;
          task_id: string;
        };
        Update: {
          tag_id?: string;
          task_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_tag_relationship_tag_id_fkey';
            columns: ['tag_id'];
            isOneToOne: false;
            referencedRelation: 'task_tags';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_tag_relationship_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      task_tags: {
        Row: {
          color: string | null;
          id: string;
          name: string;
        };
        Insert: {
          color?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          color?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      task_titles: {
        Row: {
          id: string;
          title: string;
        };
        Insert: {
          id?: string;
          title: string;
        };
        Update: {
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          approval_assignees: string[] | null;
          approval_satisfaction_type: string | null;
          assignee_ids: string[] | null;
          attachments: Json | null;
          branch_ids: string[] | null;
          completed_at: string | null;
          completion_type: string | null;
          created_at: string | null;
          creator_ids: string[] | null;
          department_ids: string[] | null;
          depends_on_task_id: string | null;
          description: string | null;
          due_date: string | null;
          extended: boolean | null;
          id: string;
          needs_approval: boolean | null;
          priority: string | null;
          property_id: number | null;
          status: string | null;
          title_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          approval_assignees?: string[] | null;
          approval_satisfaction_type?: string | null;
          assignee_ids?: string[] | null;
          attachments?: Json | null;
          branch_ids?: string[] | null;
          completed_at?: string | null;
          completion_type?: string | null;
          created_at?: string | null;
          creator_ids?: string[] | null;
          department_ids?: string[] | null;
          depends_on_task_id?: string | null;
          description?: string | null;
          due_date?: string | null;
          extended?: boolean | null;
          id?: string;
          needs_approval?: boolean | null;
          priority?: string | null;
          property_id?: number | null;
          status?: string | null;
          title_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          approval_assignees?: string[] | null;
          approval_satisfaction_type?: string | null;
          assignee_ids?: string[] | null;
          attachments?: Json | null;
          branch_ids?: string[] | null;
          completed_at?: string | null;
          completion_type?: string | null;
          created_at?: string | null;
          creator_ids?: string[] | null;
          department_ids?: string[] | null;
          depends_on_task_id?: string | null;
          description?: string | null;
          due_date?: string | null;
          extended?: boolean | null;
          id?: string;
          needs_approval?: boolean | null;
          priority?: string | null;
          property_id?: number | null;
          status?: string | null;
          title_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_depends_on_task_id_fkey';
            columns: ['depends_on_task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_property_id_fkey';
            columns: ['property_id'];
            isOneToOne: false;
            referencedRelation: 'properties';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_title_id_fkey';
            columns: ['title_id'];
            isOneToOne: false;
            referencedRelation: 'task_titles';
            referencedColumns: ['id'];
          },
        ];
      };
      teams: {
        Row: {
          created_at: string;
          department_id: number | null;
          description: string | null;
          id: number;
          team_name: string;
        };
        Insert: {
          created_at?: string;
          department_id?: number | null;
          description?: string | null;
          id?: never;
          team_name: string;
        };
        Update: {
          created_at?: string;
          department_id?: number | null;
          description?: string | null;
          id?: never;
          team_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teams_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      tokens: {
        Row: {
          access_token: string | null;
          active: boolean | null;
          created_at: string;
          expires_in: number | null;
          id: number;
          issued_at: string | null;
          refresh_token: string | null;
          type: string | null;
        };
        Insert: {
          access_token?: string | null;
          active?: boolean | null;
          created_at?: string;
          expires_in?: number | null;
          id?: number;
          issued_at?: string | null;
          refresh_token?: string | null;
          type?: string | null;
        };
        Update: {
          access_token?: string | null;
          active?: boolean | null;
          created_at?: string;
          expires_in?: number | null;
          id?: number;
          issued_at?: string | null;
          refresh_token?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      user_branches: {
        Row: {
          branch_id: number;
          user_id: string;
        };
        Insert: {
          branch_id: number;
          user_id: string;
        };
        Update: {
          branch_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_branches_branch_id_fkey';
            columns: ['branch_id'];
            isOneToOne: false;
            referencedRelation: 'branches';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_branches_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_branches_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_departments: {
        Row: {
          department_id: number;
          user_id: string;
        };
        Insert: {
          department_id: number;
          user_id: string;
        };
        Update: {
          department_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_departments_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_departments_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_departments_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_profiles: {
        Row: {
          biography_description: string | null;
          biography_title: string | null;
          birthday: string | null;
          business_number: string | null;
          created_at: string | null;
          email: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
          mobile_number: string | null;
          profile_picture: string | null;
          work_anniversary: string | null;
        };
        Insert: {
          biography_description?: string | null;
          biography_title?: string | null;
          birthday?: string | null;
          business_number?: string | null;
          created_at?: string | null;
          email: string;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          mobile_number?: string | null;
          profile_picture?: string | null;
          work_anniversary?: string | null;
        };
        Update: {
          biography_description?: string | null;
          biography_title?: string | null;
          birthday?: string | null;
          business_number?: string | null;
          created_at?: string | null;
          email?: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          mobile_number?: string | null;
          profile_picture?: string | null;
          work_anniversary?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          role_id: number;
          user_id: string;
        };
        Insert: {
          role_id: number;
          user_id: string;
        };
        Update: {
          role_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_roles_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'roles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_roles_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      user_teams: {
        Row: {
          created_at: string;
          team_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          team_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          team_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_teams_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_teams_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profile_complete';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_teams_user_id_fkey1';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      route_permissions_complete: {
        Row: {
          created_at: string | null;
          department_ids: number[] | null;
          departments: string[] | null;
          developing: boolean | null;
          icon: string | null;
          id: string | null;
          label: string | null;
          main_navigation: boolean | null;
          parent_path: string | null;
          path: string | null;
          public: boolean | null;
          role_ids: number[] | null;
          roles: string[] | null;
          sort_order: number | null;
          team_ids: number[] | null;
          teams: string[] | null;
          user_ids: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'route_permissions_parent_path_fkey';
            columns: ['parent_path'];
            isOneToOne: false;
            referencedRelation: 'route_permissions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'route_permissions_parent_path_fkey';
            columns: ['parent_path'];
            isOneToOne: false;
            referencedRelation: 'route_permissions_complete';
            referencedColumns: ['id'];
          },
        ];
      };
      user_profile_complete: {
        Row: {
          biography_description: string | null;
          biography_title: string | null;
          birthday: string | null;
          branch_ids: number[] | null;
          branches: string[] | null;
          business_number: string | null;
          created_at: string | null;
          department_ids: number[] | null;
          departments: string[] | null;
          email: string | null;
          first_name: string | null;
          id: string | null;
          last_name: string | null;
          mobile_number: string | null;
          profile_picture: string | null;
          role_ids: number[] | null;
          roles: string[] | null;
          team_ids: number[] | null;
          teams: string[] | null;
          work_anniversary: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      fetch_auction_data: {
        Args: {
          auction_id: number;
        };
        Returns: Json;
      };
      fetch_event_details: {
        Args: {
          p_event_id: number;
        };
        Returns: {
          event_id: number;
          event_type: string;
          event_data: Json;
        }[];
      };
      fetch_portfolio_events: {
        Args: {
          portfolio_id: number;
        };
        Returns: Json;
      };
      get_active_portfolio_with_auctions: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_all_portfolio_data: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_article_with_details: {
        Args: {
          article_id: number;
        };
        Returns: Json;
      };
      get_comments_with_reactions: {
        Args: {
          p_entity_type: string;
          p_entity_id: string;
        };
        Returns: Json;
      };
      get_limited_user_profile: {
        Args: {
          user_id: string;
        };
        Returns: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          profile_picture: string;
        }[];
      };
      get_property_with_agent_details: {
        Args: {
          property_id: string;
        };
        Returns: Json;
      };
      increment_article_view: {
        Args: {
          article_id_param: number;
        };
        Returns: Json;
      };
      insert_comment: {
        Args: {
          p_entity_id: string;
          p_entity_type: string;
          p_comment: string;
          p_parent_id?: string;
        };
        Returns: Json;
      };
      sync_existing_department_chat_rooms: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      sync_existing_users_to_burgess_rawson: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      toggle_article_reaction: {
        Args: {
          p_article_id: number;
          p_reaction_type: string;
        };
        Returns: Json;
      };
      toggle_comment_reaction: {
        Args: {
          p_comment_id: string;
          p_reaction_type: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
