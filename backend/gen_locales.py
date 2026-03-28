import json
import os
from deep_translator import GoogleTranslator

UI_STRINGS = {
    "app_name": "Pratinidhi AI",
    # (SideBar)
    "nav_dashboard": "Dashboard",
    "nav_create": "Create Announcement",
    "nav_analytics": "Analytics",
    "nav_receivers": "Citizen Receivers",
    "nav_ask": "Ask Avatar",
    "nav_settings": "Settings",
    "nav_broadcast": "Admin Broadcast",
    "nav_live_qa": "Live Q&A",
    "nav_platform_analytics": "Platform Analytics",
    
    # (Settings)
    "set_title": "Settings",
    "set_subtitle": "Manage your account and platform preferences",
    "set_save": "Save Changes",
    "set_saved": "Saved!",
    "set_profile": "Profile Settings",
    "set_name": "Full Name",
    "set_email": "Phone Number",
    "set_dept": "State/Department",
    "set_role": "Role",
    "set_lang_pref": "Language Preferences",
    "set_lang_sub": "Powered by BHASHINI Multilingual AI",
    "set_voice_pref": "Voice Settings",
    "set_security": "Compliance & Security",
    "set_otp": "OTP Consent Lock",
    "set_otp_sub": "Require OTP verification before citizens can view messages",
    "set_mcc": "MCC Compliance",
    "set_mcc_sub": "Automatically flag Model Code of Conduct violations",
    "set_notifications": "Notifications",
    
    # Dashboard 
    "dash_title": "Dashboard",
    "dash_welcome": "Welcome back",
    "dash_avatars": "Total Avatars Generated",
    "dash_langs": "Languages Used",
    "dash_citizens": "Citizens Reached",
    "dash_msgs": "Messages Delivered",
    "dash_recent": "Recent Announcements",
    "dash_view_all": "View All",
    "dash_create": "Create New Avatar",
    "dash_create_sub": "Generate a multilingual avatar announcement",
    "dash_analytics": "View Analytics",
    "dash_analytics_sub": "Track citizen engagement & reach",
    "dash_ask": "Ask Avatar Q&A",
    "dash_ask_sub": "AI-powered citizen query system",

    # Receivers Form & Table
    "recv_title": "My Receivers",
    "recv_sub": "Manage your target audience and demographic lists",
    "recv_upload": "Upload CSV",
    "recv_add_contact": "Add New Contact",
    "recv_full_name": "Full Name",
    "recv_phone": "Phone",
    "recv_email": "Email",
    "recv_language": "Language",
    "recv_type": "Type",
    "recv_state": "State",
    "recv_district": "District",
    "recv_has_wa": "Has WhatsApp",
    "recv_app_user": "App User",
    "recv_save_btn": "Save Contact",
    "recv_roster": "Contact Roster",
    "recv_total": "Total:",
    "recv_name_col": "Name",
    "recv_contact_col": "Contact",
    "recv_lang_col": "Language",
    "recv_loc_col": "Location",
    "recv_tags_col": "Tags",
    "recv_empty": "No receivers added yet.",
    "recv_empty_sub": "Use the form to build your list.",

    # Messages/Preview
    "msg_title": "Messages",
    "msg_sub": "Manage your broadcasts and citizen engagement",
    "msg_sent": "Sent Broadcasts",
    "msg_inbox": "Citizen Inbox",
    "msg_sent_badge": "Sent Broadcast",
    "preview_title": "Avatar Preview",
    "preview_sub": "Review, approve, and share your generated avatar",
    "preview_dl": "Download",
    "preview_wa": "WhatsApp",
    "preview_pub": "Publish",
    "preview_audio": "Audio Preview",
    "preview_audio_feature": "Translated Feature",
    "preview_audio_desc": "Listen to the translated speech. Each receiver gets custom audio in their language via WhatsApp.",
    "preview_vid_qual": "Video Quality",
    "preview_link": "Citizen View Link",
    "preview_copy": "Copy",
    "preview_copied": "Copied!",
    "preview_details": "Details",
    "preview_lang": "Preview Language",
    "preview_created": "Created",
    "preview_orig": "Original",
    "preview_trans": "Translated Text",

    # Create Announcement
    "create_title": "Create Announcement",
    "create_sub": "AI-powered multilingual avatar generation pipeline",
    "create_step1": "Content",
    "create_step2": "Avatar",
    "create_step3": "Generate",
    "create_msg_title": "Input Message",
    "create_msg_sub": "Type your announcement or record a voice note.",
    "create_record": "Record Voice",
    "create_ph": "e.g., Dear Citizens, the new health clinic is opening tomorrow...",
    "create_avatar_title": "Select an Avatar",
    "create_avatar_sub": "Pick the digital representative to deliver the message.",
    "create_search": "Search styles...",
    "create_ready": "Ready to Broadcast",
    "create_ready_sub": "Select target language and begin AI generation pipeline.",
    "create_len": "Message Length:",
    "create_trans_lang": "Translation Language",
    "create_back": "Back",
    "create_gen_btn": "Generate Avatar",
    "create_proc": "Processing AI Pipeline",
    "avatar_asha": "Asha",
    "avatar_arjun": "Arjun",
    "avatar_murugan": "Murugan",
    "avatar_priya": "Priya",
    "avatar_asha_desc": "Empathetic Speaker",
    "avatar_arjun_desc": "Authoritative Speaker",
    "avatar_murugan_desc": "Regional Representative",
    "avatar_priya_desc": "Youth Leader"
}

TARGET_LANGUAGES = ['hi', 'mr', 'ta', 'te', 'bn']

def generate_locales():
    output_dir = os.path.join("..", "frontend", "src", "locales")
    os.makedirs(output_dir, exist_ok=True)
    
    en_dir = os.path.join(output_dir, "en")
    os.makedirs(en_dir, exist_ok=True)
    with open(os.path.join(en_dir, "translation.json"), "w", encoding="utf-8") as f:
        json.dump(UI_STRINGS, f, indent=2, ensure_ascii=False)
        
    for lang in TARGET_LANGUAGES:
        print(f"Translating to {lang} via deep_translator...")
        lang_dir = os.path.join(output_dir, lang)
        os.makedirs(lang_dir, exist_ok=True)
        
        translator = GoogleTranslator(source='en', target=lang)
        translated_dict = {}
        for k, v in UI_STRINGS.items():
            try:
                translated_dict[k] = translator.translate(v)
            except Exception as e:
                print(f"Failed {k}: {e}")
                translated_dict[k] = v
                
        with open(os.path.join(lang_dir, "translation.json"), "w", encoding="utf-8") as f:
            json.dump(translated_dict, f, indent=2, ensure_ascii=False)
            
    print("All UI strings updated successfully via direct GoogleTranslator fallback.")

if __name__ == "__main__":
    generate_locales()
